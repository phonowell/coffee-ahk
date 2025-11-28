/**
 * Utility functions for ctx-transform
 */
import forbidden from '../../../../data/forbidden.json' with { type: 'json' }
import { CTX } from '../../../constants.js'

import type Item from '../../../models/Item.js'
import type { Context } from '../../../types'

/**
 * AHK keywords set (lowercase) for Native string variable detection.
 * Built from forbidden.json - excludes A_ variables (already skipped by shouldVarUseCtx).
 */
export const AHK_KEYWORDS = new Set(
  forbidden
    .filter((x): x is string => typeof x === 'string')
    .filter((x) => !x.startsWith('A_'))
    .map((x) => x.toLowerCase()),
)

/** Check if a variable name should use ctx based on simple rules */
export const shouldVarUseCtx = (
  ctx: Context,
  varName: string,
  inFunction: boolean,
): boolean => {
  if (!inFunction) return false
  if (ctx.cache.global.has(varName)) return false
  if (varName.startsWith('__') && varName.endsWith('__')) return false
  if (varName === 'this') return false
  if (varName === CTX) return false
  const first = varName[0]
  if (first && /^[A-Z]$/.test(first)) return false
  if (varName.startsWith('ℓ')) return false
  return true
}

/** Check if a variable name should use ctx in Native strings */
export const shouldVarUseCtxInNative = (
  ctx: Context,
  varName: string,
  inFunction: boolean,
): boolean => {
  // First apply basic rules
  if (!shouldVarUseCtx(ctx, varName, inFunction)) return false
  // Skip uppercase-starting variables (class names, AHK commands)
  const first = varName[0]
  if (first && /^[A-Z]$/.test(first)) return false
  // Then check AHK keywords (case-insensitive)
  if (AHK_KEYWORDS.has(varName.toLowerCase())) return false
  return true
}

/** Check if identifier should use ctx (local variable inside function) */
export const shouldUseCtx = (
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
  // Skip uppercase identifiers (class names, etc.) - only check if first char is A-Z
  if (first && /^[A-Z]$/.test(first)) return false
  // Skip internal variables (ℓxxx)
  if (item.value.startsWith('ℓ')) return false

  // Skip object key names (identifier followed by : in object scope)
  if (next?.is('sign', ':') && item.scope.includes('object')) return false

  // Skip catch variable (identifier after 'catch' keyword)
  if (prev?.is('try', 'catch')) return false

  return true
}

/** Check if function name is extracted user function (salt_N pattern) */
export const isUserFunc = (name: string | undefined, salt: string): boolean => {
  if (!name?.startsWith(`${salt}_`)) return false
  if (salt === 'salt') return false // skip builtin compilation
  return /^\d+$/.test(name.slice(salt.length + 1))
}
