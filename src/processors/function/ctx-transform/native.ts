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
 * Collect and transform Native string in a single pass (optimized).
 * Returns both the transformed string and the set of variables found.
 */
export const collectAndTransformNative = (
  ctx: Context,
  value: string,
  inFunction: boolean,
): { transformed: string; vars: Set<string> } => {
  const vars = new Set<string>()
  if (!inFunction) return { transformed: value, vars }

  const idPattern = /\$?[a-z_][a-z0-9_$]*/gi

  // First pass: transform %name% to %λ_name% format and collect vars
  let result = value.replace(/%([a-z_$][a-z0-9_$]*)%/gi, (match, varName) => {
    if (shouldVarUseCtxInNative(ctx, varName, inFunction)) {
      vars.add(varName)
      return `%${CTX}_${varName}%`
    }
    return match
  })

  // Second pass: transform all identifiers to λ_xxx format and collect vars
  result = result.replace(idPattern, (match, offset) => {
    if (match === CTX) return match

    const charBefore = offset > 0 ? result[offset - 1] : ''
    if (charBefore === '.') return match
    if (charBefore === 'ℓ') return match
    // Skip if inside %λ_xxx% (already transformed)
    if (charBefore === '_' && offset >= 2 && result[offset - 2] === CTX)
      return match

    // Skip if inside %xxx% that was already transformed to %λ_xxx%
    if (
      charBefore === '%' ||
      (charBefore === '_' && offset >= 3 && result[offset - 3] === '%')
    )
      return match

    const afterPos = offset + match.length
    const charAfter = afterPos < result.length ? result[afterPos] : ''
    if (charAfter === '(') return match
    if (charAfter === '%') return match

    if (shouldVarUseCtxInNative(ctx, match, inFunction)) {
      vars.add(match)
      return `${CTX}_${match}`
    }

    return match
  })

  return { transformed: result, vars }
}

/** Process a native block - collect consecutive natives, transform vars, add assignments */
export const processNativeBlock = (
  ctx: Context,
  content: Context['content'],
  startIdx: number,
  _firstItem: Item,
  out: Item[],
) => {
  // Collect all consecutive natives and their transformations in one pass
  const nativeBlock: Array<{ item: Item; transformed: string }> = []
  const allVars = new Set<string>()
  let j = startIdx

  // Process all consecutive native items
  while (j < content.length) {
    const item = content.at(j)
    if (!item) break

    if (item.type === 'native') {
      const { transformed, vars } = collectAndTransformNative(
        ctx,
        item.value,
        item.scope.includes('function'),
      )
      nativeBlock.push({ item, transformed })
      for (const v of vars) allVars.add(v)
      j++
      continue
    }

    // Allow new-lines between natives
    if (item.type === 'new-line' && nativeBlock.length > 0) {
      nativeBlock.push({ item, transformed: item.value })
      j++
      continue
    }

    // Stop at first non-native, non-newline item
    if (nativeBlock.length > 0) break
    j++
  }

  // If no vars need transformation, just push original items
  if (allVars.size === 0) {
    for (const { item } of nativeBlock) out.push(item)
    return
  }

  const firstNative = nativeBlock.find((n) => n.item.type === 'native')
  if (!firstNative) return

  const scope = firstNative.item.scope.toArray()

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

  // Push transformed native items
  for (const { item, transformed } of nativeBlock) {
    if (item.type === 'native') {
      const newItem = new Item({
        type: 'native',
        value: transformed,
        scope: item.scope.toArray(),
      })
      if (item.comment) newItem.comment = [...item.comment]
      out.push(newItem)
    } else out.push(item)
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
