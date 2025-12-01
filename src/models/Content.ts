import Item, { type ItemOptions } from './Item.js'

import type Scope from './Scope'

type ItemArg = ItemOptions | Item

/** A collection of items of the AST. */
class Content {
  /** @private */
  #list: Item[] = []

  scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  get length(): number {
    return this.#list.length
  }

  /** Iterator support for for-of loops (zero-copy traversal) */
  *[Symbol.iterator](): IterableIterator<Item> {
    yield* this.#list
  }

  /** Returns a shallow copy of the items array. */
  toArray(): Item[] {
    return [...this.#list]
  }

  at(index: number): Item | undefined {
    return this.#list.at(index)
  }

  /** Removes and returns the last item in the content, or undefined if empty. */
  pop(): Item | undefined {
    return this.#list.pop()
  }

  /** Adds one or more items to the end of the content. */
  push(...args: ItemArg[]): this {
    for (const arg of args) {
      const newItem = arg instanceof Item ? arg : new Item(arg)
      if (!newItem.scope.length) newItem.scope.reload(this.scope)
      this.#list.push(newItem)
    }
    return this
  }

  /** Reloads the content with a new list of items. */
  reload(list: Item[] = this.#list): this {
    this.#list = list.filter((it) => !it.is('void'))
    return this
  }

  /** Removes and returns the first item in the content, or undefined if empty. */
  shift(): Item | undefined {
    return this.#list.shift()
  }

  /** Adds one or more items to the beginning of the content. */
  unshift(...args: ItemArg[]): this {
    for (const arg of args.reverse()) {
      const newItem = arg instanceof Item ? arg : new Item(arg)
      if (!newItem.scope.length) newItem.scope.reload(this.scope)
      this.#list.unshift(newItem)
    }
    return this
  }
}

export default Content
