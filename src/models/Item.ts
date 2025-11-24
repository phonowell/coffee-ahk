import Scope from './Scope.js'

import type { ItemType } from './ItemType.js'

/** An item of the AST */
class Item {
  comment?: string[]
  scope: Scope
  type: ItemType
  value: string

  /** Creates a new item with type, value, and scope, or clones from another Item. */
  constructor(
    ...args:
      | [
          type?: Item['type'],
          value?: Item['value'],
          scope?: ConstructorParameters<typeof Scope>[0],
        ]
      | [Item]
  ) {
    if (args[0] instanceof Item) {
      const item = args[0]
      this.type = item.type
      this.value = item.value
      this.scope = new Scope(item.scope)
      if (item.comment) this.comment = [...item.comment]
      return
    }

    const [type, value, scope] = args
    this.type = type ?? 'void'
    this.value = value ?? type ?? ''
    this.scope = new Scope(scope)
  }

  /** Clones the item. */
  clone(): Item {
    return new Item(this)
  }

  /** Checks if the item is of a certain type and value. */
  is(expectedType: ItemType, expectedValue?: string): boolean {
    if (expectedType !== this.type) return false
    if (typeof expectedValue === 'undefined') return true
    return expectedValue === this.value
  }
}

export default Item
