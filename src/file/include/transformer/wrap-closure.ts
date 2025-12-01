/**
 * Closure wrapping logic for module exports.
 */

import { run } from 'fire-keeper'

import { MODULE_PREFIX } from '../../../constants.js'
import { closureCoffee as wrapClosure } from '../utils.js'

type Meta = { content: string; dependencies: string[]; id: number }

/**
 * Generate return statement for module exports.
 */
export const generateReturnStatement = (
  exportDefault: string[],
  exportNamed: string[],
): string =>
  run(() => {
    // default 和命名导出共存
    if (exportDefault.length && exportNamed.length) {
      const namedObj = exportNamed
        .map((s) => (s.includes(':') ? s : `${s}: ${s}`))
        .join(', ')
      return `return { default: ${exportDefault[0]}, ${namedObj} }`
    }

    // 只导出 default
    if (exportDefault.length) return `return { default: ${exportDefault[0]} }`

    if (exportNamed.length) {
      const namedObj = exportNamed
        .map((s) => (s.includes(':') ? s : `${s}: ${s}`))
        .join(', ')
      return `return { ${namedObj} }`
    }

    // 没有任何导出
    return ''
  })

/**
 * Wrap code in closure and generate module assignment.
 */
export const wrapInClosureAndAssign = (
  codeLines: string[],
  exportDefault: string[],
  exportNamed: string[],
  meta: Meta,
  salt: string,
): string => {
  const returnLine = generateReturnStatement(exportDefault, exportNamed)
  if (returnLine) codeLines.push(returnLine)

  const closureBody = wrapClosure(codeLines.join('\n'))
  const hasExports = exportDefault.length > 0 || exportNamed.length > 0

  return [
    hasExports ? `${MODULE_PREFIX}_${salt}_${meta.id} = do ->` : 'do ->',
    closureBody,
  ].join('\n')
}

/**
 * Generate closure-wrapped module code.
 * Returns the final module code string ready to be cached.
 */
export const generateModuleCode = (
  codeLines: string[],
  exportDefault: string[],
  exportNamed: string[],
  meta: Meta,
  salt: string,
): string =>
  wrapInClosureAndAssign(
    [...codeLines], // Clone to avoid mutation
    exportDefault,
    exportNamed,
    meta,
    salt,
  )
