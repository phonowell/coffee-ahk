// Utility functions for content processing

export const listExt = ['.ahk', '.coffee', '.json', '.yaml'] as const

export const closureCoffee = (content: string) =>
  content
    .split(/\n/u)
    .map((line) => `  ${line}`)
    .join('\n')

type BlockDelimiter = '###' | '"""' | "'''"

/**
 * Per-line code mask for line-oriented scans (import/export detection).
 * Lines that start inside a multiline block (### comment, ''' or """
 * heredoc) are masked so their content can't be misdetected as statements.
 */
export const codeLineMask = (content: string): boolean[] => {
  const mask: boolean[] = []
  let block: BlockDelimiter | null = null

  for (const line of content.split('\n')) {
    mask.push(block === null)

    let i = 0
    while (i < line.length) {
      if (block) {
        const end = line.indexOf(block, i)
        if (end === -1) break
        block = null
        i = end + 3
        continue
      }

      const ch = line.at(i)
      if (ch === '"') {
        if (line.slice(i, i + 3) === '"""') {
          block = '"""'
          i += 3
          continue
        }
        let j = i + 1
        while (j < line.length && line.at(j) !== '"') j += line.at(j) === '\\' ? 2 : 1
        i = j + 1
        continue
      }
      if (ch === "'") {
        if (line.slice(i, i + 3) === "'''") {
          block = "'''"
          i += 3
          continue
        }
        let j = i + 1
        while (j < line.length && line.at(j) !== "'") j += line.at(j) === '\\' ? 2 : 1
        i = j + 1
        continue
      }
      if (ch === '#' && line.slice(i, i + 3) === '###') {
        block = '###'
        i += 3
        continue
      }
      if (ch === '#') break // line comment: rest is not code
      i++
    }
  }

  return mask
}
