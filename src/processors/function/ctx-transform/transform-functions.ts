/**
 * Function transformation for ctx-transform
 *
 * Transforms function definitions to add λ parameter and initialize param assignments.
 */
import { CTX, THIS } from '../../../constants.js'
import Item from '../../../models/Item.js'

import { genParamAssign, genThisAlias } from './params.js'
import { isUserFunc } from './utils.js'

import type { ParamsInfo } from './params.js'
import type { Context } from '../../../types'

/** Transform function definitions - add λ param and init */
export const transformFunctions = (
  ctx: Context,
  paramsInfo: ParamsInfo,
): Set<number> => {
  const { params, classMethods } = paramsInfo
  const { content } = ctx
  const salt = ctx.options.salt ?? ''
  const out: Item[] = []
  const skip = new Set<number>()

  let inFunc = false
  let funcScope: Item['scope'] | null = null
  let funcName = ''
  let didInit = false

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue

    // Start of function parameter list
    if (item.is('edge', 'parameter-start')) {
      const prev = content.at(i - 1)
      if (prev?.type === 'function' && isUserFunc(prev.value, salt)) {
        inFunc = true
        funcScope = item.scope
        funcName = prev.value
        didInit = false

        const p = params.get(funcName) ?? []
        const _scope = item.scope.toArray()
        out.push(item)
        // λ is always pre-bound via .Bind({}) or .Bind(λ), no default needed
        out.push(new Item({ type: 'identifier', value: CTX, scope: _scope }))
        if (p.length > 0)
          out.push(new Item({ type: 'sign', value: ',', scope: _scope }))

        continue
      }
    }

    // End of function parameters
    if (inFunc && funcScope && item.is('edge', 'parameter-end')) {
      if (item.scope.isEqual(funcScope)) {
        out.push(item)
        continue
      }
    }

    // Start of function body - add param assignments
    if (item.is('edge', 'block-start') && inFunc && !didInit) {
      out.push(item)
      didInit = true

      const scope = item.scope.toArray()
      const allParams = params.get(funcName) ?? []
      const hasThis = allParams.includes(THIS)

      // Add this := ℓthis if function has ℓthis parameter (both class methods and closures)
      if (hasThis) {
        out.push(new Item({ type: 'new-line', value: '1', scope }))
        out.push(...genThisAlias(scope).slice(1)) // skip leading new-line
      }

      // Skip param assignments for class methods - they don't need ctx transformation
      if (classMethods.has(funcName)) continue

      const p = allParams.filter((x) => x !== 'this' && x !== THIS)

      for (const param of p) {
        const items = genParamAssign(param, scope)
        skip.add(out.length + items.length - 1) // mark last item (identifier)
        out.push(...items)
      }
      continue
    }

    // End of function body
    if (
      item.is('edge', 'block-end') &&
      inFunc &&
      !item.scope.includes('function')
    ) {
      inFunc = false
      funcScope = null
      funcName = ''
    }

    out.push(item)
  }

  content.reload(out)
  return skip
}
