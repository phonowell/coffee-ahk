import cache from './class/cache'
import content from './class/content'

export type Context = {
  cache: typeof cache
  content: typeof content
  indent: number
  raw: Token
  type: string
  value: string
}

export type Token = {
  comments?: Object
  generated?: boolean
  origin?: [string]
}