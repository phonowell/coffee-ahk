/**
 * Export statement parsing logic.
 * Extracts export default and export named from CoffeeScript source.
 */

import { ErrorType, TranspileError } from '../../../utils/error.js'
import { codeLineMask } from '../utils.js'

import type { Context } from '../../../types/index.js'

/** Create minimal Context for export parsing errors */
const createExportContext = (lineNumber: number): Pick<Context, 'token'> => ({
  token: ['', '', { first_line: lineNumber - 1, last_line: lineNumber - 1 }] as Context['token'],
})

export type ParsedExports = {
  exportDefault: string[]
  exportNamed: string[]
  codeLines: string[]
}

/**
 * Split on top-level commas only — nested (), [], {} and string literals
 * must not break `export {a: f(1, 2)}` into fragments.
 */
const splitTopLevel = (input: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let quote = ''
  let current = ''

  for (let i = 0; i < input.length; i++) {
    const ch = input.at(i) ?? ''
    if (quote) {
      current += ch
      if (ch === '\\') {
        current += input.at(i + 1) ?? ''
        i++
      } else if (ch === quote) quote = ''
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      current += ch
      continue
    }
    if ('([{'.includes(ch)) depth++
    else if (')]}'.includes(ch)) depth--
    else if (ch === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

/**
 * Parse and extract export statements from CoffeeScript source.
 * Returns exportDefault, exportNamed arrays and remaining codeLines.
 */
export const parseExportsFromCoffee = (replaced: string, filePath?: string): ParsedExports => {
  const exportDefault: string[] = []
  const exportNamed: string[] = []
  const codeLines: string[] = []

  const lines = replaced.split('\n')
  const mask = codeLineMask(replaced)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line) {
      i++
      continue
    }
    const trimmed = line.trim()
    // 只处理 export 开头的行；heredoc/块注释内的行不算代码
    if (!mask[i] || !trimmed.startsWith('export ')) {
      // Skip type annotation comments (###* ... ###) immediately before export
      // They will be handled with the export they annotate
      if (trimmed.match(/^###\*.*###$/)) {
        // Peek ahead to see if next non-empty line is export
        let nextIdx = i + 1
        while (nextIdx < lines.length && !lines[nextIdx]?.trim()) nextIdx++

        if (lines[nextIdx]?.trim().startsWith('export ')) {
          // Skip this type comment, it belongs to the export
          i++
          continue
        }
      }

      codeLines.push(line)
      i++
      continue
    }

    // export default foo 或 export default ->
    const exportDefaultMatch = /^export\s+default\s+(.+)/.exec(trimmed)
    if (exportDefaultMatch?.[1]) {
      if (exportDefault.length) {
        throw new TranspileError(
          createExportContext(i + 1) as Context,
          ErrorType.SYNTAX_ERROR,
          `duplicate 'export default'${filePath ? ` in '${filePath}'` : ''}\n  Line: ${trimmed}`,
          `A module can only have one default export`,
        )
      }
      // 判断是否为多行缩进块
      const exportLineIndent = RegExp(/^(\s*)/).exec(line)?.[1] ?? ''
      const exportBody = [exportDefaultMatch[1]]
      let j = i + 1
      while (j < lines.length) {
        const nextLine = lines[j]
        // Check for undefined (end of array), not empty string
        if (nextLine === undefined) break
        if (
          nextLine.trim() === '' ||
          nextLine.startsWith(`${exportLineIndent} `) ||
          nextLine.startsWith(`${exportLineIndent}\t`)
        ) {
          exportBody.push(nextLine.slice(exportLineIndent.length))
          j++
        } else break
      }
      exportDefault.push(exportBody.join('\n').trim())
      i = j
      continue
    }

    // export {a, b} or export {a: foo()}; `export {}` is a legal no-op
    const exportNamedMatch = /^export\s*{(.*)}/.exec(trimmed)
    if (exportNamedMatch) {
      const body = exportNamedMatch[1]?.trim()
      if (body) {
        splitTopLevel(body).forEach((seg) => {
          if (!seg) return
          exportNamed.push(seg)
        })
      }
      i++
      continue
    }

    // 检测不支持的 export 语法
    const fileInfo = filePath ? ` in '${filePath}'` : ''
    if (/^export\s+(const|let|var|function|class)\s+/.test(trimmed)) {
      throw new TranspileError(
        createExportContext(i + 1) as Context,
        ErrorType.UNSUPPORTED,
        `unsupported syntax "export const/let/var/function/class"${fileInfo}\n  Line: ${trimmed}`,
        `Use "export { name }" or "export default" instead`,
      )
    }
    if (/^export\s+\*/.test(trimmed)) {
      throw new TranspileError(
        createExportContext(i + 1) as Context,
        ErrorType.UNSUPPORTED,
        `unsupported syntax "export *"${fileInfo}\n  Line: ${trimmed}`,
        `Use "export { name1, name2 }" instead`,
      )
    }

    // 其他未识别的 export 语法
    throw new TranspileError(
      createExportContext(i + 1) as Context,
      ErrorType.SYNTAX_ERROR,
      `unrecognized export syntax${fileInfo}\n  Line: ${trimmed}`,
      `Use "export default <expr>", "export { a, b }", or "export { a: expr() }"`,
    )
  }
  return { exportDefault, exportNamed, codeLines }
}
