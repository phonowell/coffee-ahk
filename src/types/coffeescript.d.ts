declare module 'coffeescript' {
  export type Token = [
    string,
    string & {
      generated?: boolean
      parsedValue?: unknown
      quote?: string
    },
    { first_line: number; last_line: number },
  ] & {
    comments?: { content: string }[]
    data?: unknown
    generated?: boolean
    indentSize?: number
    newLine?: boolean
    spaced?: boolean
  }

  export function compile(content: string, options?: { ast?: boolean }): { tokens: Token[] }
}
