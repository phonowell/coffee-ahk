/**
 * Convert logical AND (&&) chains ending in a non-boolean literal to ternary
 * expressions for value-producing patterns.
 * Transforms: a := b && "yes" → a := (ℓand := b) ? "yes" : ℓand
 * Chained: a := x && y && "d" → a := (ℓand := x) ? ((ℓand := y) ? "d" : ℓand) : ℓand
 *
 * This is necessary because in AHK v1, && returns boolean (0 or 1),
 * not the last evaluated operand like in JavaScript.
 */

import Item from '../models/Item.js'

import type { Context } from '../types/index.js'

const AND_TEMP = 'ℓand'

/** Split items on top-level `&&` operators (nested edges/brackets stay inside their part). */
const splitOnAnd = (items: Item[]): Item[][] => {
  const parts: Item[][] = [[]]
  let depth = 0
  for (const it of items) {
    if (it.type === 'edge' && it.value.endsWith('-start')) depth++
    else if (it.type === 'edge' && it.value.endsWith('-end')) depth--
    else if (it.type === 'bracket' && (it.value === '(' || it.value === '{')) depth++
    else if (it.type === 'bracket' && (it.value === ')' || it.value === '}')) depth--
    else if (depth === 0 && it.type === 'logical-operator' && it.value === '&&') {
      parts.push([])
      continue
    }
    parts.at(-1)?.push(it)
  }
  return parts
}

/** Check whether a part is a non-boolean literal (number, string, nil, negative number). */
const isNonBooleanLiteral = (part: Item[]): boolean => {
  const first = part.at(0)
  if (!first) return false
  if (['number', 'string', 'nil'].includes(first.type)) return true
  // negative numbers: negative + number
  return first.type === 'negative' && part.at(1)?.type === 'number'
}

const isOpener = (it: Item): boolean =>
  (it.type === 'edge' && it.value.endsWith('-start')) ||
  (it.type === 'bracket' && (it.value === '(' || it.value === '[' || it.value === '{'))

const isCloser = (it: Item): boolean =>
  (it.type === 'edge' && it.value.endsWith('-end')) ||
  (it.type === 'bracket' && (it.value === ')' || it.value === ']' || it.value === '}'))

/** Items that bound the left side of an expression chain and mark it as a
 * value position: assignment, separators, ternary arms, return/throw, openers. */
const isLeftBoundary = (it: Item): boolean =>
  (it.type === 'sign' && ['=', ':=', ',', '?', ':'].includes(it.value)) ||
  (it.type === 'statement' && (it.value === 'return' || it.value === 'throw'))

/** Hard statement boundary — the `&&` is not in a value position. */
const isStatementBoundary = (it: Item): boolean =>
  it.type === 'new-line' ||
  it.type === 'if' ||
  it.type === 'for' ||
  it.type === 'while' ||
  it.type === 'try' ||
  it.type === 'class' ||
  (it.type === 'statement' && it.value !== 'return' && it.value !== 'throw')

/** A top-level `||` inside an operand has looser precedence — regrouping
 * `a || b && "d"` into `(a || b) && "d"` would invert the semantics. */
const containsOr = (part: Item[]): boolean => {
  let depth = 0
  return part.some((it) => {
    if (isOpener(it)) depth++
    else if (isCloser(it)) depth--
    else if (depth === 0 && it.type === 'logical-operator' && it.value === '||') return true
    return false
  })
}

export default (ctx: Context): void => {
  const { content } = ctx

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (item?.type !== 'logical-operator' || item.value !== '&&') continue

    // Locate the chain start: scan backward with depth tracking so operand
    // groups like `(a || b) && "c"` stay whole. `||` bounds an && chain on
    // the left — `a || b && "c"` is `a || (b && "c")`, not `(a || b) && "c"`.
    let depth = 0
    let leftStart = -1
    for (let j = i - 1; j >= 0; j--) {
      const prev = content.at(j)
      if (!prev) break
      if (depth > 0) {
        if (isCloser(prev)) depth++
        else if (isOpener(prev)) depth--
        continue
      }
      if (isCloser(prev)) {
        depth++
        continue
      }
      if (isStatementBoundary(prev)) break
      if (
        (prev.type === 'logical-operator' && prev.value === '||') ||
        isLeftBoundary(prev) ||
        isOpener(prev)
      ) {
        leftStart = j + 1
        break
      }
      // identifiers, literals, `&&`, math — chain content
    }
    if (leftStart === -1) continue

    // Find the end of the chain — `||` also bounds it on the right
    depth = 0
    let rightEnd = content.length
    for (let j = i + 1; j < content.length; j++) {
      const next = content.at(j)
      if (!next) break
      if (depth > 0) {
        if (isOpener(next)) depth++
        else if (isCloser(next)) depth--
        continue
      }
      if (isOpener(next)) {
        depth++
        continue
      }
      if (
        isCloser(next) ||
        isStatementBoundary(next) ||
        next.is('sign', ',') ||
        (next.type === 'sign' && (next.value === '?' || next.value === ':')) ||
        (next.type === 'logical-operator' && next.value === '||')
      ) {
        rightEnd = j
        break
      }
    }

    // Split the whole chain into &&-separated parts so multi-operand chains
    // (`a && b && "d"`) evaluate left-to-right preserving operand values
    const parts = splitOnAnd(content.slice(leftStart, rightEnd)).filter((p) => p.length > 0)
    if (parts.length < 2) continue

    // Only convert if the last operand is a non-boolean literal (number, string, nil)
    // This distinguishes value patterns (a = b && "yes") from boolean logic (a = b && c)
    if (!isNonBooleanLiteral(parts.at(-1) ?? [])) continue

    // A top-level `||` inside an operand has looser precedence — regrouping
    // `a || b && "d"` into `(a || b) && "d"` would invert the semantics
    if (parts.slice(0, -1).some(containsOr)) continue

    const first = parts.at(0)?.at(0)
    if (!first) continue

    // Right-fold into nested ternaries, each level binding its operand to ℓand
    // so every operand is evaluated once and its value preserved.
    // Group parens are emitted as 'bracket' (not 'edge') so renderSign's `:`
    // lookback — which stops at edges — can still find the matching `?`.
    let ternary: Item[] = parts.at(-1) ?? []
    for (let k = parts.length - 2; k >= 0; k--) {
      const part = parts.at(k)
      const anchor = part?.at(0)
      if (!part || !anchor) break
      const partScope = anchor.scope.toArray()

      const questionMark = anchor.clone()
      questionMark.type = 'sign'
      questionMark.value = '?'
      const colon = anchor.clone()
      colon.type = 'sign'
      colon.value = ':'

      ternary = [
        new Item({ type: 'bracket', value: '(', scope: partScope }),
        new Item({ type: 'bracket', value: '(', scope: partScope }),
        new Item({ type: 'identifier', value: AND_TEMP, scope: partScope }),
        new Item({ type: 'sign', value: '=', scope: partScope }),
        ...part,
        new Item({ type: 'bracket', value: ')', scope: partScope }),
        questionMark,
        ...ternary,
        colon,
        new Item({ type: 'identifier', value: AND_TEMP, scope: partScope }),
        new Item({ type: 'bracket', value: ')', scope: partScope }),
      ]
    }

    // Remove old items and insert ternary
    content.splice(leftStart, rightEnd - leftStart, ...ternary)

    // Adjust index since we modified the content
    i = leftStart + ternary.length - 1
  }
}
