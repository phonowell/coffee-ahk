import type { PartialOptions } from './options.js'
import type Content from '../models/Content.js'
import type Item from '../models/Item.js'
import type Scope from '../models/Scope.js'
import type * as cs from 'coffeescript'

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
  isTypeofUsed: boolean
}

/** Context plus the current item index/pointer used during rendering */
export type RenderContext = Context & { i: number; it: Item }

type Token = ReturnType<typeof cs.compile>['tokens'][number]

export type TokenLocationData = {
  first_line: number
  first_column: number
  last_line: number
  last_column: number
}

export type CommentData = {
  content: string
  locationData?: TokenLocationData
}
