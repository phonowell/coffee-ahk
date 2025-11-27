/**
 * Context Transform Processor
 *
 * Transforms variable access to use λ (lambda) object for proper closure semantics.
 * Inner functions can read AND modify outer function variables via shared λ.
 * Using λ (U+03BB) as it semantically represents closures and saves 6 chars vs __ctx__.
 */
import { CTX, THIS } from '../../constants.js'
import Item from '../../models/Item.js'

import type { ScopeType } from '../../models/ScopeType.js'
import type { Context } from '../../types'

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
  if (item.value === CTX) return false // skip λ itself

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

  for (let i = 0; i < content.length; i++) {
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
    // Detect parameter: followed by , or ) or ... or = or . (for destructuring like {a.b})
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

/** Generate ctx init items: if (!λ) λ := {} */
const genCtxInit = (scope: ScopeType[]): Item[] => [
  new Item({ type: 'if', value: 'if', scope }),
  new Item({ type: 'edge', value: 'expression-start', scope }),
  new Item({ type: 'logical-operator', value: '!', scope }),
  new Item({ type: 'identifier', value: CTX, scope }),
  new Item({ type: 'edge', value: 'expression-end', scope }),
  new Item({ type: 'native', value: ' ', scope }),
  new Item({ type: 'identifier', value: CTX, scope }),
  new Item({ type: 'sign', value: '=', scope }),
  new Item({ type: 'edge', value: 'object-start', scope }),
  new Item({ type: 'edge', value: 'object-end', scope }),
]

/** Generate param assignment: λ.param := param */
const genParamAssign = (param: string, scope: ScopeType[]): Item[] => [
  new Item({ type: 'new-line', value: '1', scope }),
  new Item({ type: 'identifier', value: CTX, scope }),
  new Item({ type: '.', value: '.', scope }),
  new Item({ type: 'identifier', value: param, scope }),
  new Item({ type: 'sign', value: '=', scope }),
  new Item({ type: 'identifier', value: param, scope }),
]

/** Generate this alias: this := ℓthis */
const genThisAlias = (scope: ScopeType[]): Item[] => [
  new Item({ type: 'new-line', value: '1', scope }),
  new Item({ type: 'this', value: 'this', scope }),
  new Item({ type: 'sign', value: '=', scope }),
  new Item({ type: 'identifier', value: THIS, scope }),
]

/** Transform function definitions - add λ param and init */
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
        out.push(item)
        out.push(
          new Item({
            type: 'identifier',
            value: CTX,
            scope: item.scope.toArray(),
          }),
        )
        if (p.length > 0) {
          out.push(
            new Item({ type: 'sign', value: ',', scope: item.scope.toArray() }),
          )
        }
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
      const hasThis = allParams.includes(THIS)
      const p = allParams.filter((x) => x !== 'this' && x !== THIS)

      out.push(new Item({ type: 'new-line', value: '1', scope }))
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

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)

    if (item.type === 'identifier' && prev?.is('try', 'catch'))
      result.add(item.value)
  }

  return result
}

/** Collect for loop variable names and their block-start positions */
const collectForVars = (
  ctx: Context,
): { vars: Set<string>; blockStarts: Map<number, string[]> } => {
  const { content } = ctx
  const vars = new Set<string>()
  const blockStarts = new Map<number, string[]>()
  const len = content.length

  for (let i = 0; i < len; i++) {
    const item = content.at(i)
    if (!item?.is('for', 'for')) continue
    if (!item.scope.includes('function')) continue

    // Collect variables between 'for' and 'in'
    const loopVars: string[] = []
    for (let j = i + 1; j < len; j++) {
      const it = content.at(j)
      if (!it) break
      if (it.is('for-in', 'in')) break
      if (it.type === 'identifier') {
        const v = it.value
        // Skip internal variables (ℓxxx) and global variables
        if (v.startsWith('ℓ')) continue
        if (ctx.cache.global.has(v)) continue
        vars.add(v)
        loopVars.push(v)
      }
    }

    // Find block-start for this for loop (only if we have vars to transform)
    if (loopVars.length === 0) continue
    for (let j = i + 1; j < len; j++) {
      const it = content.at(j)
      if (!it) break
      if (it.is('edge', 'block-start') && it.scope.at(-1) === 'for') {
        blockStarts.set(j, loopVars)
        break
      }
    }
  }

  return { vars, blockStarts }
}

/** Transform variable access: identifier -> λ.identifier */
const transformVars = (ctx: Context, skip: Set<number>) => {
  const { content } = ctx
  const out: Item[] = []
  const catchVars = collectCatchVars(ctx)
  const { vars: forVars, blockStarts: forBlockStarts } = collectForVars(ctx)

  // Track for scope depth to skip for-declaration variables
  let inForDecl = false

  for (let i = 0; i < content.length; i++) {
    const item = content.at(i)
    if (!item) continue
    const prev = content.at(i - 1)
    const next = content.at(i + 1)

    // Track for declaration region (between 'for' and 'in')
    if (item.is('for', 'for')) inForDecl = true
    if (item.is('for-in', 'in')) inForDecl = false

    // Insert λ.xxx := xxx after for block-start
    if (forBlockStarts.has(i)) {
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

/** Add .Bind(λ) after Func() calls inside functions */
const addBind = (ctx: Context) => {
  const { content } = ctx
  const out: Item[] = []

  for (let i = 0; i < content.length; i++) {
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
    out.push(new Item({ type: '.', value: '.', scope }))
    out.push(new Item({ type: 'identifier', value: 'Bind', scope }))
    out.push(
      new Item({
        type: 'edge',
        value: 'call-start',
        scope: [...scope, 'call'],
      }),
    )
    out.push(
      new Item({ type: 'identifier', value: CTX, scope: [...scope, 'call'] }),
    )
    out.push(
      new Item({ type: 'edge', value: 'call-end', scope: [...scope, 'call'] }),
    )
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
