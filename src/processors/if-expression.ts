/**
 * Convert inline if-then-else expressions to ternary operators.
 * Transforms: a := if b then c else d → a := b ? c : d
 * Chained: a := if b then c else if d then e else f → a := b ? c : d ? e : f
 *
 * Pattern to match:
 * 1. Find 'if' item
 * 2. Check if it's in expression context (after := or = assignment)
 * 3. Extract condition, then-branch, and else-branch (else-if recurses as new segment)
 * 4. Convert to right-associative ternary: c1 ? t1 : c2 ? t2 : else
 */
import { createTranspileError, ErrorType } from '../utils/error.js'
/**
 * Note: In processor stage, INDENT/OUTDENT tokens have been converted to edges:
 * - INDENT → new-line + block-start edge
 * - OUTDENT → new-line + block-end edge
 */

import type Item from '../models/Item.js'
import type { Context } from '../types/index.js'

const hasNestedIf = (branch: Item[]): boolean =>
  branch.some((it) => it.type === 'if' && it.value === 'if')

/** Branch items that can't live inside a ternary operand: block keywords
 * (`if`/`switch`/`case` are all 'if'-typed), loops, try, class, and
 * statement keywords other than `new` (`a ? return 1 : ""` is invalid AHK). */
const hasBlockItem = (branch: Item[]): boolean =>
  branch.some(
    (it) =>
      it.type === 'if' ||
      it.type === 'for' ||
      it.type === 'while' ||
      it.type === 'try' ||
      it.type === 'class' ||
      (it.type === 'statement' &&
        (it.value === 'return' ||
          it.value === 'throw' ||
          it.value === 'break' ||
          it.value === 'continue' ||
          it.value === 'extends')),
  )

const clean = (branch: Item[]) => branch.filter((it) => it.type !== 'new-line')

/** Find the first matching item scanning forward; `bounded` stops at non-newline items. */
const findForward = (
  ctx: Context,
  from: number,
  match: (it: Item) => boolean,
  bounded: boolean,
): number => {
  const { content } = ctx
  for (let j = from; j < content.length; j++) {
    const next = content.at(j)
    if (!next) break
    if (match(next)) return j
    if (bounded && next.type !== 'new-line') break
  }
  return -1
}

/** Find the block-end matching the block that started just before `from`. */
const findBlockEnd = (ctx: Context, from: number): number => {
  const { content } = ctx
  let depth = 1
  for (let j = from; j < content.length; j++) {
    const next = content.at(j)
    if (!next) break
    if (next.type === 'edge') {
      if (next.value === 'block-start') depth++
      else if (next.value === 'block-end') {
        depth--
        if (depth === 0) return j
      }
    }
  }
  return -1
}

type Chain = {
  segments: {
    condition: Item[]
    thenBranch: Item[]
    /** item index range of the then-block contents: (start, end) */
    thenStart: number
    thenEnd: number
  }[]
  elseBranch: Item[] | undefined
  elseStart: number | undefined
  elseEnd: number | undefined
  end: number
}

/** Read `if cond block (else if cond block)* (else block)?` starting at the 'if' index. */
const readChain = (ctx: Context, start: number): Chain | null => {
  const { content } = ctx
  const segments: Chain['segments'] = []
  let cursor = start

  while (true) {
    const condEdge = findForward(ctx, cursor + 1, (it) => it.is('edge', 'expression-start'), false)
    if (condEdge === -1) return null

    const condEnd = findForward(ctx, condEdge + 1, (it) => it.is('edge', 'expression-end'), false)
    if (condEnd === -1) return null

    const thenEdge = findForward(ctx, condEnd + 1, (it) => it.is('edge', 'block-start'), true)
    if (thenEdge === -1) return null

    const thenEnd = findBlockEnd(ctx, thenEdge + 1)
    if (thenEnd === -1) return null

    segments.push({
      condition: content.slice(condEdge + 1, condEnd),
      thenBranch: content.slice(thenEdge + 1, thenEnd),
      thenStart: thenEdge + 1,
      thenEnd,
    })

    const elseIndex = findForward(ctx, thenEnd + 1, (it) => it.is('if', 'else'), true)
    // No else: `x = if a then b` → a ? b : ""
    if (elseIndex === -1)
      return {
        segments,
        elseBranch: undefined,
        elseStart: undefined,
        elseEnd: undefined,
        end: thenEnd + 1,
      }

    // `else if` continues the chain
    const nextIf = findForward(ctx, elseIndex + 1, (it) => it.is('if', 'if'), true)
    if (nextIf !== -1) {
      cursor = nextIf
      continue
    }

    const elseEdge = findForward(ctx, elseIndex + 1, (it) => it.is('edge', 'block-start'), true)
    if (elseEdge === -1) return null

    const elseEnd = findBlockEnd(ctx, elseEdge + 1)
    if (elseEnd === -1) return null

    return {
      segments,
      elseBranch: content.slice(elseEdge + 1, elseEnd),
      elseStart: elseEdge + 1,
      elseEnd,
      end: elseEnd + 1,
    }
  }
}

/** True when only new-lines separate `end` from a block-end edge — i.e. the
 * if-chain is the last statement of its enclosing block. */
const isBlockEnd = (ctx: Context, end: number): boolean => {
  const { content } = ctx
  let j = end
  while (content.at(j)?.is('new-line') === true) j++
  return content.at(j)?.is('edge', 'block-end') === true
}

/** Insert `return` before the last statement in item range (start, end). */
const injectReturn = (ctx: Context, start: number, end: number): void => {
  const { content } = ctx
  // The last statement's head = the first item after the last depth-0
  // new-line; new-lines inside nested blocks don't split statements
  let depth = 0
  let head = -1
  let boundary = true
  for (let j = start; j < end; j++) {
    const it = content.at(j)
    if (!it) break
    if (it.is('edge', 'block-start') === true) {
      depth++
      boundary = false
      continue
    }
    if (it.is('edge', 'block-end') === true) {
      depth--
      boundary = false
      continue
    }
    if (it.type === 'new-line' && depth === 0) {
      boundary = true
      continue
    }
    if (boundary) {
      head = j
      boundary = false
    }
  }
  if (head === -1) return
  const stmt = content.at(head)
  if (!stmt) return
  // Tail is another `if`: push `return` into its branch tails instead —
  // `if a { if b { x } }` → `if a { if b { return x } }`
  if (stmt.type === 'if') {
    if (stmt.value !== 'if') return
    const inner = readChain(ctx, head)
    if (!inner) return
    if (inner.elseStart !== undefined && inner.elseEnd !== undefined)
      injectReturn(ctx, inner.elseStart, inner.elseEnd)
    for (let k = inner.segments.length - 1; k >= 0; k--) {
      const seg = inner.segments.at(k)
      if (seg) injectReturn(ctx, seg.thenStart, seg.thenEnd)
    }
    return
  }
  // Statements and other block keywords can't follow `return`
  if (
    stmt.type === 'statement' ||
    stmt.type === 'for' ||
    stmt.type === 'while' ||
    stmt.type === 'try' ||
    stmt.type === 'class'
  )
    return
  const ret = stmt.clone()
  ret.type = 'statement'
  ret.value = 'return'
  content.splice(head, 0, ret)
}

export default (ctx: Context): void => {
  const { content } = ctx

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (item?.type !== 'if' || item.value !== 'if') continue

    // An `if` is an expression when an operand position precedes it on the
    // same line: `x = if` / `return if` / `(if` / `f(if` / `, if` / `? if`
    let inline = false
    for (let j = i - 1; j >= 0; j--) {
      const prev = content.at(j)
      if (!prev || prev.type === 'new-line') break
      if (
        (prev.type === 'sign' && [':=', '=', ',', '?', ':'].includes(prev.value)) ||
        (prev.type === 'statement' && (prev.value === 'return' || prev.value === 'throw')) ||
        (prev.type === 'edge' &&
          (prev.value === 'call-start' ||
            prev.value === 'expression-start' ||
            prev.value === 'index-start' ||
            prev.value === 'array-start' ||
            prev.value === 'object-start')) ||
        (prev.type === 'bracket' && (prev.value === '(' || prev.value === '['))
      ) {
        inline = true
        break
      }
    }

    const chain = readChain(ctx, i)
    if (!chain || !chain.segments.length) {
      // Inside call/array/object scopes `then` produces no block edges —
      // the expression can't be recovered, reject instead of emitting junk
      if (inline)
        throw createTranspileError(
          ErrorType.UNSUPPORTED,
          `if-expression in this position is not supported`,
          `Assign it to a variable first: x = if c then a else b; f(x)`,
        )
      continue
    }

    if (!inline) {
      // A function's tail `if` yields the implicit return value: inject
      // `return` before each branch's last statement instead. Branches are
      // processed right-to-left so splices don't shift pending ranges
      if (item.scope.at(-1) === 'function' && isBlockEnd(ctx, chain.end)) {
        if (chain.elseStart !== undefined && chain.elseEnd !== undefined)
          injectReturn(ctx, chain.elseStart, chain.elseEnd)
        for (let k = chain.segments.length - 1; k >= 0; k--) {
          const seg = chain.segments.at(k)
          if (seg) injectReturn(ctx, seg.thenStart, seg.thenEnd)
        }
      }
      continue
    }

    if (
      chain.segments.some((s) => hasNestedIf(s.thenBranch)) ||
      hasNestedIf(chain.elseBranch ?? [])
    ) {
      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        `Nested if-then-else expressions are not supported`,
        `Use temporary variables: temp = if inner then a else b; result = if outer then temp else c` +
          `Workaround 2 - Use IIFE with early return:\n` +
          `  result = do ->\n` +
          `    if condition1 then return x\n` +
          `    if condition2 then return y\n` +
          `    z`,
      )
    }

    if (
      chain.segments.some((s) => hasBlockItem(s.thenBranch)) ||
      hasBlockItem(chain.elseBranch ?? [])
    ) {
      throw createTranspileError(
        ErrorType.UNSUPPORTED,
        `if-expression branches must be single expressions`,
        `Use a statement-level if/else block instead`,
      )
    }

    const firstItem = chain.segments.at(0)?.condition.at(0)
    if (!firstItem) continue
    if (chain.segments.some((s) => !s.condition.length || !clean(s.thenBranch).length)) continue

    // Missing else maps to "" (nil) — CoffeeScript yields undefined
    const elseOperand: Item[] =
      chain.elseBranch && clean(chain.elseBranch).length
        ? clean(chain.elseBranch)
        : [Object.assign(firstItem.clone(), { type: 'string' as const, value: '""' })]

    // Right-fold: c1 ? t1 : c2 ? t2 : else (AHK ternary is right-associative)
    let ternary: Item[] = elseOperand
    for (let k = chain.segments.length - 1; k >= 0; k--) {
      const seg = chain.segments.at(k)
      const first = seg?.condition.at(0)
      if (!seg || !first) break

      const questionMark = first.clone()
      questionMark.type = 'sign'
      questionMark.value = '?'
      const colon = first.clone()
      colon.type = 'sign'
      colon.value = ':'

      ternary = [...seg.condition, questionMark, ...clean(seg.thenBranch), colon, ...ternary]
    }

    content.splice(i, chain.end - i, ...ternary)
    i += ternary.length - 1
  }
}
