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

/**
 * An item of the AST.
 * Fields are mutable by design — processors rewrite items in place
 * (e.g. marking `void`, renaming values). The contract: an Item must not
 * occupy more than one position unless it was produced by clone(); reuse
 * without cloning makes later in-place edits leak across positions.
 */
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
  is<T extends ItemType>(expectedType: T, expectedValue?: ItemTypeMap[T]): boolean {
    if (expectedType !== this.type) return false
    if (typeof expectedValue === 'undefined') return true
    return expectedValue === this.value
  }
}

export default Item
