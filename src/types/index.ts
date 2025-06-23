import type { PartialOptions } from '../index'
import type Content from '../models/Content'
import type Scope from '../models/Scope'
import type cs from 'coffeescript'

type Cache = {
  global: Set<string>
}

type Context = {
  cache: Cache
  content: Content
  flag: Flag
  indent: number
  options: PartialOptions
  scope: Scope
  token: Token & { origin?: Token }
  type: string
  value: string
}

type Flag = {
  isChangeIndexUsed: boolean
  isFunctionIncluded: boolean
  isPromiseUsed: boolean
}

type Token = ReturnType<typeof cs.compile>['tokens'][number]

export type { Cache, Context, Flag }
