import type { PartialOptions } from '../index'
import type Content from '../models/Content'
import type Scope from '../models/Scope'
import type cs from 'coffeescript'

export type Cache = {
  global: Set<string>
  classNames: Set<string>
  identifiers: Set<string>
}

export type Context = {
  cache: Cache
  content: Content
  flag: Flag
  indent: number
  options: PartialOptions
  scope: Scope
  token: Token & { origin?: Token }
  type: string
  value: string
  warnings: string[]
}

export type Flag = {
  isChangeIndexUsed: boolean
}

type Token = ReturnType<typeof cs.compile>['tokens'][number]
