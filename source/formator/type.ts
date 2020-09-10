import cacheBlock from './cache/block'

export type Context = {
  cacheBlock: typeof cacheBlock
  indent: number
  listResult: (string | number)[]
  raw: Token
  type: string
  value: string | number
}

export type Token = {
  comments?: Object
  generated?: boolean
  origin?: [string]
}