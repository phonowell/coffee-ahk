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
      const { scope, type, value } = args[0]
      this.type = type
      this.value = value
      this.scope = new Scope(scope)
      return
    }

    this.type = args[0] ?? 'void'
    this.value = (typeof args[1] === 'undefined' ? args[0] : args[1]) ?? ''
    this.scope = new Scope(args[2])
  }

  /** Clones the item. */
  clone(): Item {
    const { scope, type, value } = this
    return new Item(type, value, scope)
  }

  /** Checks if the item is of a certain type and value. */
  is(expectedType: ItemType, expectedValue?: string): boolean {
    if (expectedType !== this.type) return false
    if (typeof expectedValue === 'undefined') return true
    return expectedValue === this.value
  }
}

export default Item
