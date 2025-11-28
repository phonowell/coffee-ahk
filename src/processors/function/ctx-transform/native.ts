/**
 * Native string transformation for ctx-transform
 *
 * Handles variable bridging for AHK v1 commands that don't accept object properties.
 * Uses temporary variables (λ_var) to bridge between λ.var and native commands.
 */
import { CTX } from '../../../constants.js'
import Item from '../../../models/Item.js'

import { shouldVarUseCtxInNative } from './utils.js'

import type { Context } from '../../../types'

/**
 * Collect variables from Native string that need ctx transformation.
 * Returns a Set of variable names found in the Native string.
 */
export const collectNativeVars = (
  ctx: Context,
  value: string,
  inFunction: boolean,
): Set<string> => {
  const vars = new Set<string>()
  if (!inFunction) return vars

  const idPattern = /\$?[a-z_][a-z0-9_$]*/gi

  // Collect from %name% syntax
  value.replace(/%([a-z_$][a-z0-9_$]*)%/gi, (_, varName) => {
    if (shouldVarUseCtxInNative(ctx, varName, inFunction)) vars.add(varName)
    return ''
  })

  // Collect from direct identifiers
  value.replace(idPattern, (match, offset) => {
    if (match === CTX) return ''
    const charBefore = offset > 0 ? value[offset - 1] : ''
    if (charBefore === '.') return ''
    if (charBefore === 'ℓ') return ''
    const afterPos = offset + match.length
    const charAfter = afterPos < value.length ? value[afterPos] : ''
    if (charAfter === '(') return ''
    if (shouldVarUseCtxInNative(ctx, match, inFunction)) vars.add(match)
    return ''
  })

  return vars
}

/**
 * Transform Native string - replace variable references with λ_xxx format.
 * This allows AHK commands to use simple variables instead of object properties.
 */
export const transformNativeString = (
  ctx: Context,
  value: string,
  inFunction: boolean,
): string => {
  if (!inFunction) return value

  const idPattern = /\$?[a-z_][a-z0-9_$]*/gi

  // First: transform %name% to %λ_name% format
  let result = value.replace(/%([a-z_$][a-z0-9_$]*)%/gi, (match, varName) => {
    if (shouldVarUseCtxInNative(ctx, varName, inFunction))
      return `%${CTX}_${varName}%`
    return match
  })

  // Second: transform all identifiers to λ_xxx format
  result = result.replace(idPattern, (match, offset) => {
    if (match === CTX) return match

    const charBefore = offset > 0 ? result[offset - 1] : ''
    if (charBefore === '.') return match
    if (charBefore === 'ℓ') return match
    // Skip if inside %λ_xxx% (already transformed)
    if (charBefore === '_' && offset >= 2 && result[offset - 2] === CTX)
      return match

    // Skip if inside %xxx% that was already transformed to %λ_xxx%
    // Check if we're between % signs with λ_ prefix
    if (
      charBefore === '%' ||
      (charBefore === '_' && offset >= 3 && result[offset - 3] === '%')
    )
      return match

    const afterPos = offset + match.length
    const charAfter = afterPos < result.length ? result[afterPos] : ''
    if (charAfter === '(') return match
    // Skip if followed by % (inside %xxx%)
    if (charAfter === '%') return match

    if (shouldVarUseCtxInNative(ctx, match, inFunction))
      return `${CTX}_${match}`

    return match
  })

  return result
}

/** Process a native block - collect consecutive natives, transform vars, add assignments */
export const processNativeBlock = (
  ctx: Context,
  content: Context['content'],
  startIdx: number,
  firstItem: Item,
  out: Item[],
) => {
  const nativeBlock: Item[] = [firstItem]
  const allVars = new Set<string>()
  let j = startIdx + 1

  // Collect vars from first native
  for (const v of collectNativeVars(
    ctx,
    firstItem.value,
    firstItem.scope.includes('function'),
  ))
    allVars.add(v)

  // Look ahead for consecutive natives (may have new-lines between)
  while (j < content.length) {
    const nextItem = content.at(j)
    if (!nextItem) break
    if (nextItem.type === 'new-line') {
      nativeBlock.push(nextItem)
      j++
      continue
    }
    if (nextItem.type === 'native') {
      nativeBlock.push(nextItem)
      for (const v of collectNativeVars(
        ctx,
        nextItem.value,
        nextItem.scope.includes('function'),
      ))
        allVars.add(v)
      j++
      continue
    }
    break
  }

  // If no vars need transformation, just push original items
  if (allVars.size === 0) {
    for (const nativeItem of nativeBlock) out.push(nativeItem)
    return
  }

  const scope = firstItem.scope.toArray()

  // Insert λ_var := λ.var before native block
  for (const v of allVars) {
    out.push(new Item({ type: 'identifier', value: `${CTX}_${v}`, scope }))
    out.push(new Item({ type: 'sign', value: '=', scope }))
    out.push(new Item({ type: 'identifier', value: CTX, scope }))
    out.push(new Item({ type: '.', value: '.', scope }))
    out.push(new Item({ type: 'identifier', value: v, scope }))
    out.push(
      new Item({ type: 'new-line', value: scope.length.toString(), scope }),
    )
  }

  // Transform and push native items
  for (const nativeItem of nativeBlock) {
    if (nativeItem.type === 'native') {
      const transformed = transformNativeString(
        ctx,
        nativeItem.value,
        nativeItem.scope.includes('function'),
      )
      const newItem = new Item({
        type: 'native',
        value: transformed,
        scope: nativeItem.scope.toArray(),
      })
      if (nativeItem.comment) newItem.comment = [...nativeItem.comment]
      out.push(newItem)
    } else out.push(nativeItem)
  }

  // Insert λ.var := λ_var after native block
  // Remove trailing newline if present (we'll add our own with correct indentation)
  const lastItem = out.at(out.length - 1)
  if (lastItem?.type === 'new-line') out.pop()

  for (const v of allVars) {
    out.push(
      new Item({ type: 'new-line', value: scope.length.toString(), scope }),
    )
    out.push(new Item({ type: 'identifier', value: CTX, scope }))
    out.push(new Item({ type: '.', value: '.', scope }))
    out.push(new Item({ type: 'identifier', value: v, scope }))
    out.push(new Item({ type: 'sign', value: '=', scope }))
    out.push(new Item({ type: 'identifier', value: `${CTX}_${v}`, scope }))
  }
  // Add final newline after write-back
  out.push(
    new Item({ type: 'new-line', value: scope.length.toString(), scope }),
  )
}
