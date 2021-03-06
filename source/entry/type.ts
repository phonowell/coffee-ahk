import { Option } from '../index'
import content from '../module/Content'
import scope from '../module/Scope'

export type Cache = {
  global: Set<string>
}

export type Context = {
  cache: Cache
  content: typeof content
  flag: Flag
  indent: number
  option: Option
  raw: Token
  scope: typeof scope
  type: string
  value: string
}

export type Flag = {
  isChangeIndexUsed?: boolean
}

export type Token = {
  comments?: {
    content: string
  }[]
  generated?: boolean
  origin?: unknown[] & {
    [key: string]: unknown
  }
  quote?: string
  spaced?: boolean
}