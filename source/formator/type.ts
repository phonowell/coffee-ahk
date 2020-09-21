import cache from './module/cache'
import content from './module/content'

export type Context = {
  cache: typeof cache
  content: typeof content
  indent: number
  raw: Token
  type: string
  value: string
}

export type Token = {
  comments?: {
    content: string
  }[]
  generated?: boolean
  origin?: [string]
  spaced?: boolean
}