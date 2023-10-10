import Scope from '../models/Scope'
import { OptionPartial } from '../index'
import Content from '../models/Content'

export type Cache = {
  global: Set<string>
}

export type Context = {
  cache: Cache
  content: Content
  flag: Flag
  indent: number
  option: OptionPartial
  raw: Raw
  scope: Scope
  type: string
  value: string
}

export type Flag = {
  isChangeIndexUsed: boolean
  isFunctionIncluded: boolean
}

export type Raw = {
  comments?: {
    content: string
  }[]
  generated?: boolean
  origin?: unknown[] & Record<string, unknown>
  quote?: string
  spaced?: boolean
}
