import cs from 'coffeescript'

import Scope from '../models/Scope'
import { OptionPartial } from '../index'
import Content from '../models/Content'

type Cache = {
  global: Set<string>
}

type Context = {
  cache: Cache
  content: Content
  flag: Flag
  indent: number
  option: OptionPartial
  scope: Scope
  token: Token & { origin?: Token }
  type: string
  value: string
}

type Flag = {
  isChangeIndexUsed: boolean
  isFunctionIncluded: boolean
}

type Token = ReturnType<typeof cs.compile>['tokens'][number]

export type { Cache, Context, Flag }
