declare module 'coffeescript' {
  export function compile(
    content: string,
    options?: {
      ast?: boolean
    },
  ): unknown
}
