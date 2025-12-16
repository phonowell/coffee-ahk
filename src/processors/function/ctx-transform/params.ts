/** Parameter collection and assignment generation for ctx-transform */
import { CTX, THIS } from '../../../constants.js'
import Item from '../../../models/Item.js'
import { createFileError } from '../../../utils/error.js'

import { isUserFunc } from './utils.js'

import type { ScopeType } from '../../../models/ScopeType.js'
import type { Context } from '../../../types'

/** Result of collectParams - includes params and class method markers */
export type ParamsInfo = {
  params: Map<string, string[]>
  classMethods: Set<string> // Functions extracted from class methods (have ℓthis param)
}

/** Detect parameter name collisions in nested closures */
const detectParamCollisions = (
  params: Map<string, string[]>,
  content: Item[],
  salt: string,
): void => {
  // Build function hierarchy by detecting Func("name") calls inside function bodies
  const funcParent = new Map<string, string>()
  let currentFunc = ''

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue

    // Track current function
    if (item.type === 'function' && isUserFunc(item.value, salt)) {
      currentFunc = item.value
      continue
    }

    // Detect Func("childName") pattern - this creates closure reference
    // Pattern: identifier=Func, call-start, string=funcName, call-end
    if (
      currentFunc &&
      item.scope.includes('function') &&
      item.is('identifier', 'Func')
    ) {
      const next1 = content.at(i + 1)
      const next2 = content.at(i + 2)

      if (next1?.is('edge', 'call-start') && next2?.type === 'string') {
        // Extract function name from string (remove quotes)
        const childFunc = next2.value.slice(1, -1)
        if (isUserFunc(childFunc, salt)) funcParent.set(childFunc, currentFunc)
      }
    }

    // Exit function scope
    if (
      item.is('edge', 'block-end') &&
      currentFunc &&
      !item.scope.includes('function')
    )
      currentFunc = ''
  }

  // Check for collisions (exclude internal variables starting with ℓ)
  const errors: string[] = []
  for (const [func, funcParams] of params) {
    let ancestor = funcParent.get(func)
    while (ancestor) {
      const ancestorParams = params.get(ancestor) ?? []
      const collisions = funcParams.filter(
        (p) => ancestorParams.includes(p) && !p.startsWith('ℓ'),
      )

      if (collisions.length > 0) {
        errors.push(
          `Function '${func}' has parameter name collision with ancestor '${ancestor}': ${collisions.join(', ')}. ` +
            `This causes bugs because nested closures share the same λ context object. ` +
            `Use unique parameter names (e.g., rename to '$${collisions[0]}Inner' or '$${collisions[0]}${func}').`,
        )
      }

      ancestor = funcParent.get(ancestor)
    }
  }

  if (errors.length > 0)
    throw createFileError('closure-collision', errors.join('\n'))
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

  // Detect parameter collisions before returning
  detectParamCollisions(params, content.toArray(), salt)

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
