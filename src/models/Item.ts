import Scope from './Scope.js'

import type { ItemType, ItemTypeMap } from './ItemType.js'
import type { ScopeType } from './ScopeType.js'

type ScopeArg = Scope | ScopeType[]

/** Strict item options - type and value must match */
type StrictItemOptions<T extends ItemType> = {
  type: T
  value: ItemTypeMap[T]
  scope?: ScopeArg
  comment?: string[]
}

/** Item constructor options - distributive union ensures type-value correlation */
export type ItemOptions = { [K in ItemType]: StrictItemOptions<K> }[ItemType]

/** An item of the AST */
class Item {
  comment?: string[]
  scope: Scope
  type: ItemType
  value: string

  constructor(options: ItemOptions | Item) {
    if (options instanceof Item) {
      this.type = options.type
      this.value = options.value
      this.scope = new Scope(options.scope)
      if (options.comment) this.comment = [...options.comment]
      return
    }

    this.type = options.type
    this.value = options.value
    this.scope = new Scope(options.scope)
    if (options.comment) this.comment = [...options.comment]
  }

  /** Clones the item. */
  clone(): Item {
    return new Item(this)
  }

  /** Checks if the item is of a certain type and value. */
  is<T extends ItemType>(
    expectedType: T,
    expectedValue?: ItemTypeMap[T],
  ): boolean {
    if (expectedType !== this.type) return false
    if (typeof expectedValue === 'undefined') return true
    return expectedValue === this.value
  }
}

export default Item
