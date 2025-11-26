/**
 * Context Transform Processor
 *
 * Transforms variable access to use __ctx__ object for proper closure semantics.
 * Inner functions can read AND modify outer function variables via shared __ctx__.
 */
import Item from '../../models/Item.js'

import type { ScopeType } from '../../models/ScopeType.js'
import type { Context } from '../../types'

const CTX = '__ctx__'

/** Check if identifier should use ctx (local variable inside function) */
const shouldUseCtx = (
  ctx: Context,
  item: Item,
  prev: Item | undefined,
  next: Item | undefined,
): boolean => {
  if (item.type !== 'identifier') return false
  if (!item.scope.includes('function')) return false
  if (ctx.cache.global.has(item.value)) return false
  if (prev?.type === '.') return false
  if (item.value.startsWith('__') && item.value.endsWith('__')) return false
  if (item.value === 'this') return false

  const first = item.value[0]
  if (first && first === first.toUpperCase()) return false

  // Skip object key names (identifier followed by : in object scope)
  if (next?.is('sign', ':') && item.scope.includes('object')) return false

  // Skip catch variable (identifier after 'catch' keyword)
  if (prev?.is('try', 'catch')) return false

  return true
}

/** Check if function name is extracted user function (salt_N pattern) */
const isUserFunc = (name: string | undefined, salt: string): boolean => {
  if (!name?.startsWith(`${salt}_`)) return false
  if (salt === 'salt') return false // skip builtin compilation
  return /^\d+$/.test(name.slice(salt.length + 1))
}

/** Collect parameters for each extracted function */
const collectParams = (ctx: Context): Map<string, string[]> => {
  const { content } = ctx
  const salt = ctx.options.salt ?? ''
  const result = new Map<string, string[]>()

  let func = ''
  let collecting = false
  let scope: Item['scope'] | null = null

  for (let i = 0; i < content.toArray().length; i++) {
    const item = content.at(i)
    if (!item) continue

    if (item.type === 'function' && isUserFunc(item.value, salt)) {
      func = item.value
      result.set(func, [])
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
    const isParam =
      next?.is('sign', ',') === true ||
      next?.is('edge', 'parameter-end') === true ||
      next?.is('sign', '...') === true ||
      next?.is('sign', '=') === true ||
      next?.is('.', '.') === true

    if (isParam) result.get(func)?.push(item.value)
  }

  return result
}

/** Generate ctx init items: if (!__ctx__) __ctx__ := {} */
const genCtxInit = (scope: ScopeType[]): Item[] => [
  new Item('if', 'if', scope),
  new Item('edge', 'expression-start', scope),
  new Item('logical-operator', '!', scope),
  new Item('identifier', CTX, scope),
  new Item('edge', 'expression-end', scope),
  new Item('native', ' ', scope),
  new Item('identifier', CTX, scope),
  new Item('sign', '=', scope),
  new Item('edge', 'object-start', scope),
  new Item('edge', 'object-end', scope),
]

/** Generate param assignment: __ctx__.param := param */
const genParamAssign = (param: string, scope: ScopeType[]): Item[] => [
  new Item('new-line', '1', scope),
  new Item('identifier', CTX, scope),
  new Item('.', '.', scope),
  new Item('identifier', param, scope),
  new Item('sign', '=', scope),
  new Item('identifier', param, scope),
]

/** Generate this alias: this := __this__ */
const genThisAlias = (scope: ScopeType[]): Item[] => [
  new Item('new-line', '1', scope),
  new Item('this', 'this', scope),
  new Item('sign', '=', scope),
  new Item('identifier', '__this__', scope),
]

/** Transform function definitions - add __ctx__ param and init */
const transformFunctions = (
  ctx: Context,
  params: Map<string, string[]>,
): Set<number> => {
  const { content } = ctx
  const salt = ctx.options.salt ?? ''
  const out: Item[] = []
  const skip = new Set<number>()

  let inFunc = false
  let funcScope: Item['scope'] | null = null
  let funcName = ''
  let didInit = false

  for (let i = 0; i < content.toArray().length; i++) {
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
        out.push(item)
        out.push(new Item('identifier', CTX, item.scope.toArray()))
        if (p.length > 0) out.push(new Item('sign', ',', item.scope.toArray()))
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

    // Start of function body - add ctx init
    if (item.is('edge', 'block-start') && inFunc && !didInit) {
      out.push(item)
      didInit = true

      const scope = item.scope.toArray()
      const allParams = params.get(funcName) ?? []
      const hasThis = allParams.includes('__this__')
      const p = allParams.filter((x) => x !== 'this' && x !== '__this__')

      out.push(new Item('new-line', '1', scope))
      out.push(...genCtxInit(scope))

      // Add this := __this__ if function has __this__ parameter
      if (hasThis) out.push(...genThisAlias(scope))

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

/** Collect catch variable names */
const collectCatchVars = (ctx: Context): Set<string> => {
  const { content } = ctx
  const result = new Set<string>()

  for (let i = 0; i < content.toArray().length; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)

    if (item.type === 'identifier' && prev?.is('try', 'catch'))
      result.add(item.value)
  }

  return result
}

/** Transform variable access: identifier -> __ctx__.identifier */
const transformVars = (ctx: Context, skip: Set<number>) => {
  const { content } = ctx
  const out: Item[] = []
  const catchVars = collectCatchVars(ctx)

  for (let i = 0; i < content.toArray().length; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)
    const next = content.at(i + 1)

    // Skip catch variables (both declaration and usage)
    if (catchVars.has(item.value) && item.scope.includes('catch')) {
      out.push(item)
      continue
    }

    if (skip.has(i) || !shouldUseCtx(ctx, item, prev, next)) {
      out.push(item)
      continue
    }

    const scope = item.scope.toArray()
    out.push(new Item('identifier', CTX, scope))
    out.push(new Item('.', '.', scope))
    out.push(item.clone())
  }

  content.reload(out)
}

/** Add .Bind(__ctx__) after Func() calls inside functions */
const addBind = (ctx: Context) => {
  const { content } = ctx
  const out: Item[] = []

  for (let i = 0; i < content.toArray().length; i++) {
    const item = content.at(i)
    if (!item) continue
    out.push(item)

    if (!item.is('edge', 'call-end')) continue
    if (!item.scope.includes('function')) continue

    const prev1 = content.at(i - 1)
    const prev2 = content.at(i - 2)
    const prev3 = content.at(i - 3)

    if (prev1?.type !== 'string') continue
    if (!prev2?.is('edge', 'call-start')) continue
    if (!prev3?.is('identifier', 'Func')) continue

    // Already has .Bind?
    const next = content.at(i + 1)
    if (next?.is('.', '.') && content.at(i + 2)?.is('identifier', 'Bind'))
      continue

    const scope = item.scope.toArray()
    out.push(new Item('.', '.', scope))
    out.push(new Item('identifier', 'Bind', scope))
    out.push(new Item('edge', 'call-start', [...scope, 'call']))
    out.push(new Item('identifier', CTX, [...scope, 'call']))
    out.push(new Item('edge', 'call-end', [...scope, 'call']))
  }

  content.reload(out)
}

/** Main processor */
const main = (ctx: Context) => {
  const params = collectParams(ctx)
  const skip = transformFunctions(ctx, params)
  transformVars(ctx, skip)
  addBind(ctx)
}

export default main
