import { Option } from '../index'
import content from '../module/Content'
import scope from '../module/Scope'

export type Context = {
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
  spaced?: boolean
}