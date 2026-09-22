/**
 * Variable transformation for ctx-transform
 *
 * Transforms variable access to use λ (lambda) object for proper closure semantics.
 */
import { CTX } from '../../../constants.js'
import Item from '../../../models/Item.js'

import { processNativeBlock } from './native.js'
import { shouldUseCtx } from './utils.js'

import type { Context } from '../../../types/index.js'

/**
 * Collect all variable information in a single pass.
 * Optimized to reduce Content traversal from 2 passes to 1 pass.
 */
const collectAllVars = (
  ctx: Context,
): {
  catchVars: Set<string>
  forVars: Set<string>
  blockStartBridges: Map<number, string[]>
  blockStartGlobals: Map<number, string[]>
} => {
  const { content } = ctx
  const catchVars = new Set<string>()
  const forVars = new Set<string>()
  // Block-start positions → vars that need `λ.v := v` bridging
  // (for-loop vars and catch vars captured by nested functions)
  const blockStartBridges = new Map<number, string[]>()
  // Block-start positions → vars declared `global v` — top-level for/catch
  // vars become super-globals so closures read them without a λ context
  const blockStartGlobals = new Map<number, string[]>()
  const len = content.length

  for (let i = 0; i < len; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)

    // Collect catch variables and bridge them for nested closures
    if (item.type === 'identifier' && prev?.is('try', 'catch')) {
      catchVars.add(item.value)
      const inFunction = item.scope.includes('function')
      if (!inFunction) ctx.cache.global.add(item.value)
      // Find the catch block-start; bridge when the catch lives in a function,
      // otherwise declare the var global so top-level closures can read it
      for (let j = i + 1; j < len; j++) {
        const it = content.at(j)
        if (!it || it.type === 'new-line') break
        if (it.is('edge', 'block-start')) {
          const target = inFunction ? blockStartBridges : blockStartGlobals
          target.set(j, [...(target.get(j) ?? []), item.value])
          break
        }
      }
    }

    // Collect for loop variables
    if (!item.is('for', 'for')) continue

    // Collect variables between 'for' and 'in'/'of'
    const loopVars: string[] = []
    for (let j = i + 1; j < len; j++) {
      const it = content.at(j)
      if (!it) break
      if (it.type === 'for-in') break // handles both 'in' and 'of'
      if (it.type === 'identifier') {
        const v = it.value
        // Skip internal variables (ℓxxx) and global variables
        if (v.startsWith('ℓ')) continue
        if (ctx.cache.global.has(v)) continue
        forVars.add(v)
        loopVars.push(v)
      }
    }

    if (loopVars.length === 0) continue

    const inFunction = item.scope.includes('function')
    // Top-level loops have no enclosing λ — declare vars global instead
    if (!inFunction) for (const v of loopVars) ctx.cache.global.add(v)

    // Find block-start for this for loop (only if we have vars to transform)
    for (let j = i + 1; j < len; j++) {
      const it = content.at(j)
      if (!it) break
      if (it.is('edge', 'block-start') && it.scope.at(-1) === 'for') {
        const target = inFunction ? blockStartBridges : blockStartGlobals
        target.set(j, [...(target.get(j) ?? []), ...loopVars])
        break
      }
    }
  }

  return { catchVars, forVars, blockStartBridges, blockStartGlobals }
}

/** Transform variable access: identifier -> λ.identifier */
export const transformVars = (ctx: Context, skip: Set<number>): void => {
  const { content } = ctx
  const out: Item[] = []

  // Collect all variable info in a single pass (optimized from 2 passes)
  const { catchVars, forVars, blockStartBridges, blockStartGlobals } = collectAllVars(ctx)

  // Track for scope depth to skip for-declaration variables
  let inForDecl = false

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)
    const next = content.at(i + 1)

    // Track for declaration region (between 'for' and 'in'/'of')
    if (item.is('for', 'for')) inForDecl = true
    if (item.type === 'for-in') inForDecl = false // handles both 'in' and 'of'

    // Insert λ.xxx := xxx after for/catch block-start
    if (blockStartBridges.has(i) || blockStartGlobals.has(i)) {
      out.push(item)
      const loopVars = blockStartBridges.get(i) ?? []
      const globalVars = blockStartGlobals.get(i) ?? []
      const nextItem = content.at(i + 1)
      const indent = nextItem?.type === 'new-line' ? nextItem.value : '1'
      const scope = item.scope.toArray()
      for (const v of loopVars) {
        out.push(new Item({ type: 'new-line', value: indent, scope }))
        out.push(new Item({ type: 'identifier', value: CTX, scope }))
        out.push(new Item({ type: '.', value: '.', scope }))
        out.push(new Item({ type: 'identifier', value: v, scope }))
        out.push(new Item({ type: 'sign', value: '=', scope }))
        out.push(new Item({ type: 'identifier', value: v, scope }))
      }
      for (const v of globalVars) {
        out.push(new Item({ type: 'new-line', value: indent, scope }))
        out.push(new Item({ type: 'native', value: 'global ', scope }))
        out.push(new Item({ type: 'identifier', value: v, scope }))
      }
      continue
    }

    // Skip catch variables (both declaration and usage)
    if (catchVars.has(item.value) && item.scope.includes('catch')) {
      out.push(item)
      continue
    }

    // Skip for loop variables in declaration (for x, y in ...)
    if (inForDecl && forVars.has(item.value)) {
      out.push(item)
      continue
    }

    // Handle Native blocks
    if (item.type === 'native' && item.scope.includes('function')) {
      processNativeBlock(ctx, content, i, item, out)
      // Find end of native block
      let j = i + 1
      while (j < content.length) {
        const nextItem = content.at(j)
        if (!nextItem) break
        if (nextItem.type === 'new-line' || nextItem.type === 'native') {
          j++
          continue
        }
        break
      }
      i = j - 1
      continue
    }

    if (skip.has(i) || !shouldUseCtx(ctx, item, prev, next)) {
      out.push(item)
      continue
    }

    const scope = item.scope.toArray()
    out.push(new Item({ type: 'identifier', value: CTX, scope }))
    out.push(new Item({ type: '.', value: '.', scope }))
    out.push(item.clone())
  }

  content.reload(out)
}
