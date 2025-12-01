/**
 * Export statement parsing logic.
 * Extracts export default and export named from CoffeeScript source.
 */

export type ParsedExports = {
  exportDefault: string[]
  exportNamed: string[]
  codeLines: string[]
}

/**
 * Parse and extract export statements from CoffeeScript source.
 * Returns exportDefault, exportNamed arrays and remaining codeLines.
 */
export const parseExportsFromCoffee = (replaced: string): ParsedExports => {
  const exportDefault: string[] = []
  const exportNamed: string[] = []
  const codeLines: string[] = []

  const lines = replaced.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line) {
      i++
      continue
    }
    const trimmed = line.trim()
    // 只处理 export 开头的行
    if (!trimmed.startsWith('export ')) {
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

    // export {a, b} or export {a: foo()}
    const exportNamedMatch = /^export\s*{(.+)}/.exec(trimmed)
    if (exportNamedMatch?.[1]) {
      exportNamedMatch[1].split(',').forEach((pair) => {
        const seg = pair.trim()
        if (!seg) return
        exportNamed.push(seg)
      })
      i++
      continue
    }

    // 其他 export 忽略
    i++
  }
  return { exportDefault, exportNamed, codeLines }
}
