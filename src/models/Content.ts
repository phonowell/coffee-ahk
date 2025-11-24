import Item from './Item.js'

import type Scope from './Scope'

/** A collection of items of the AST. */
class Content {
  /** @private */
  #list: Item[] = []

  scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  /** Gets the last item in the content. */
  get last(): Item {
    return this.at(-1) ?? new Item()
  }

  get length(): number {
    return this.#list.length
  }

  /** Gets a copy of the list of items in the content. */
  get list(): Item[] {
    return [...this.#list]
  }

  at(index: number): Item | undefined {
    return this.#list.at(index)
  }

  /** Removes and returns the last item in the content. */
  pop(): Item {
    return this.#list.pop() ?? new Item()
  }

  /** Adds one or more items to the end of the content. */
  push(...args: ConstructorParameters<typeof Item>): this {
    const newItem = new Item(...args)
    if (!newItem.scope.length) newItem.scope.reload(this.scope)
    this.#list.push(newItem)
    return this
  }

  /** Reloads the content with a new list of items. */
  reload(list: Item[] = this.#list): this {
    this.#list = list.filter((it) => !it.is('void'))
    return this
  }

  /** Removes and returns the first item in the content. */
  shift(): Item {
    return this.#list.shift() ?? new Item()
  }

  /** Adds one or more items to the beginning of the content. */
  unshift(...args: ConstructorParameters<typeof Item>): this {
    const newItem = new Item(...args)
    if (!newItem.scope.length) newItem.scope.reload(this.scope)
    this.#list.unshift(newItem)
    return this
  }
}

export default Content
