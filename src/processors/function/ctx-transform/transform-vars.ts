/**
 * Variable transformation for ctx-transform
 *
 * Transforms variable access to use λ (lambda) object for proper closure semantics.
 */
import { CTX } from '../../../constants.js'
import Item from '../../../models/Item.js'

import { processNativeBlock } from './native.js'
import { isUserFunc, shouldUseCtx } from './utils.js'

import type { Context } from '../../../types'

/**
 * Collect all variable information in a single pass.
 * Optimized to reduce Content traversal from 2 passes to 1 pass.
 */
const collectAllVars = (
  ctx: Context,
  classMethods: Set<string>,
): {
  catchVars: Set<string>
  forVars: Set<string>
  forBlockStarts: Map<number, string[]>
} => {
  const { content } = ctx
  const salt = ctx.options.salt ?? ''
  const catchVars = new Set<string>()
  const forVars = new Set<string>()
  const forBlockStarts = new Map<number, string[]>()
  const len = content.length

  // Track current function to skip class methods
  let currentFunc = ''

  for (let i = 0; i < len; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)

    // Collect catch variables
    if (item.type === 'identifier' && prev?.is('try', 'catch'))
      catchVars.add(item.value)

    // Track current function
    if (item.type === 'function' && isUserFunc(item.value, salt)) {
      currentFunc = item.value
      continue
    }
    if (
      item.is('edge', 'block-end') &&
      currentFunc &&
      !item.scope.includes('function')
    ) {
      currentFunc = ''
      continue
    }

    // Collect for loop variables
    if (!item.is('for', 'for')) continue
    if (!item.scope.includes('function')) continue
    if (classMethods.has(currentFunc)) continue

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

    // Find block-start for this for loop (only if we have vars to transform)
    if (loopVars.length === 0) continue
    for (let j = i + 1; j < len; j++) {
      const it = content.at(j)
      if (!it) break
      if (it.is('edge', 'block-start') && it.scope.at(-1) === 'for') {
        forBlockStarts.set(j, loopVars)
        break
      }
    }
  }

  return { catchVars, forVars, forBlockStarts }
}

/** Transform variable access: identifier -> λ.identifier */
export const transformVars = (
  ctx: Context,
  skip: Set<number>,
  classMethods: Set<string>,
) => {
  const { content } = ctx
  const salt = ctx.options.salt ?? ''
  const out: Item[] = []

  // Collect all variable info in a single pass (optimized from 2 passes)
  const { catchVars, forVars, forBlockStarts } = collectAllVars(
    ctx,
    classMethods,
  )

  // Track for scope depth to skip for-declaration variables
  let inForDecl = false
  // Track current extracted function to skip class methods
  let currentFunc = ''

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)
    const next = content.at(i + 1)

    // Track current extracted function
    if (item.type === 'function' && isUserFunc(item.value, salt))
      currentFunc = item.value

    if (
      item.is('edge', 'block-end') &&
      currentFunc &&
      !item.scope.includes('function')
    )
      currentFunc = ''

    // Track for declaration region (between 'for' and 'in'/'of')
    if (item.is('for', 'for')) inForDecl = true
    if (item.type === 'for-in') inForDecl = false // handles both 'in' and 'of'

    // Insert λ.xxx := xxx after for block-start (only for non-class-methods)
    if (forBlockStarts.has(i) && !classMethods.has(currentFunc)) {
      out.push(item)
      const loopVars = forBlockStarts.get(i) ?? []
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

    // Handle Native blocks (skip for class methods)
    if (
      item.type === 'native' &&
      item.scope.includes('function') &&
      !classMethods.has(currentFunc)
    ) {
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

    // Skip variables inside class methods (extracted functions with ℓthis param)
    if (classMethods.has(currentFunc)) {
      out.push(item)
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
