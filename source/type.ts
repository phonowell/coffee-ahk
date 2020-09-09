export type Block = {
  argument: string[]
  content: string[]
  name: string
}

export type Data = {
  event: Block[]
  fn: Block[]
  foot: string[]
  head: string[]
  main: string[]
  mode: string[]
  raw: string
  var: string[]
}

export type Option = {
  bare: boolean
  path: string
}