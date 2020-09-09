import cacheArray from './cache/array'
import cacheBlock from './cache/block'

export type Context = {
  cacheArray: typeof cacheArray
  cacheBlock: typeof cacheBlock
  indent: number
  listResult: (string | number)[]
  raw: Token
  type: string
}

export type Token = {
  comments?: Object
}