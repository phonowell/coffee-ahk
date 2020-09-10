import cache from './class/cache'
import content from './class/content'
import storage from './class/storage'

export type Context = {
  cache: typeof cache
  content: typeof content
  indent: number
  raw: Token
  storage: typeof storage
  type: string
  value: string
}

export type Token = {
  comments?: Object
  generated?: boolean
  origin?: [string]
}