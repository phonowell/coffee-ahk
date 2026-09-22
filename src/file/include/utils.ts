// Utility functions for content processing

export const listExt = ['.ahk', '.coffee', '.json', '.yaml'] as const

export const closureCoffee = (content: string) =>
  content
    .split(/\n/u)
    .map((line) => `  ${line}`)
    .join('\n')
