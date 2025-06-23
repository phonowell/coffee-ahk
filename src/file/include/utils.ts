// Utility functions for content processing

export const listExt = ['.ahk', '.coffee', '.json', '.yaml'] as const

export const closureCoffee = (content: string) =>
  content
    .split(/\n/u)
    .map((line) => `  ${line}`)
    .join('\n')

export const contentIncludes = (content: string, target: string) => {
  const listContent = content.split('\n')
  for (const line of listContent) if (line.startsWith(target)) return true

  return false
}
