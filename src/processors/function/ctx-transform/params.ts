/** Parameter collection and assignment generation for ctx-transform */
import { CTX, THIS } from '../../../constants.js'
import Item from '../../../models/Item.js'

import { isUserFunc } from './utils.js'

import type { ScopeType } from '../../../models/ScopeType.js'
import type { Context } from '../../../types'

/** Result of collectParams - includes params and class method markers */
export type ParamsInfo = {
  params: Map<string, string[]>
  classMethods: Set<string> // Functions extracted from class methods (have ℓthis param)
}

/** Collect parameters for each extracted function */
export const collectParams = (ctx: Context): ParamsInfo => {
  const { content } = ctx
  const salt = ctx.options.salt ?? ''
  const params = new Map<string, string[]>()
  const classMethods = new Set<string>()

  let func = ''
  let collecting = false
  let scope: Item['scope'] | null = null

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue

    if (item.type === 'function' && isUserFunc(item.value, salt)) {
      func = item.value
      params.set(func, [])
      continue
    }

    if (item.is('edge', 'parameter-start') && func) {
      const prev = content.at(i - 1)
      if (prev?.type === 'function' && prev.value === func) {
        collecting = true
        scope = item.scope
      }
      continue
    }

    if (!collecting || !scope) continue

    if (item.is('edge', 'parameter-end') && item.scope.isEqual(scope)) {
      collecting = false
      scope = null
      func = ''
      continue
    }

    if (!item.is('identifier') && item.type !== 'this') continue

    const next = content.at(i + 1)
    // Detect parameter: followed by , or ) or ... or = or . (for destructuring like {a.b})
    const isParam =
      next?.is('sign', ',') === true ||
      next?.is('edge', 'parameter-end') === true ||
      next?.is('sign', '...') === true ||
      next?.is('sign', '=') === true ||
      next?.is('.', '.') === true

    if (isParam) {
      params.get(func)?.push(item.value)
      // Mark as class method if it has ℓthis parameter
      if (item.value === THIS) classMethods.add(func)
    }
  }

  return { params, classMethods }
}

/** Generate param assignment: λ.param := param */
export const genParamAssign = (param: string, scope: ScopeType[]): Item[] => [
  new Item({ type: 'new-line', value: '1', scope }),
  new Item({ type: 'identifier', value: CTX, scope }),
  new Item({ type: '.', value: '.', scope }),
  new Item({ type: 'identifier', value: param, scope }),
  new Item({ type: 'sign', value: '=', scope }),
  new Item({ type: 'identifier', value: param, scope }),
]

/** Generate this alias: this := ℓthis */
export const genThisAlias = (scope: ScopeType[]): Item[] => [
  new Item({ type: 'new-line', value: '1', scope }),
  new Item({ type: 'this', value: 'this', scope }),
  new Item({ type: 'sign', value: '=', scope }),
  new Item({ type: 'identifier', value: THIS, scope }),
]
