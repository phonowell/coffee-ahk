import at from '../utils/at.js'

import Item from './Item.js'

import type Scope from './Scope'

/**
 * A collection of items of the AST.
 */
class Content {
  /**
   * The list of items in the content.
   * @type {Item[]}
   * @private
   */
  #list: Item[] = []

  /**
   * The scope of the content.
   * @type {Scope}
   */
  scope: Scope

  /**
   * Creates a new content.
   * @param {Scope} scope - The scope of the content.
   */
  constructor(scope: Scope) {
    this.scope = scope
  }

  /**
   * Gets the last item in the content.
   * @returns {Item} The last item in the content.
   */
  get last(): Item {
    return this.at(-1) ?? new Item()
  }

  /**
   * Gets the number of items in the content.
   * @returns {number} The number of items in the content.
   */
  get length(): number {
    return this.#list.length
  }

  /**
   * Gets a copy of the list of items in the content.
   * @returns {Item[]} A copy of the list of items in the content.
   */
  get list(): Item[] {
    return [...this.#list]
  }

  /**
   * Gets the item at the specified index.
   * @param {number} n - The index of the item to get.
   * @returns {Item | undefined} The item at the specified index, or undefined if the index is out of range.
   */
  at(n: number): Item | undefined {
    return at(this.#list, n)
  }

  /**
   * Removes and returns the last item in the content.
   * @returns {Item} The last item in the content, or a new item if the content is empty.
   */
  pop(): Item {
    return this.#list.pop() ?? new Item()
  }

  /**
   * Adds one or more items to the end of the content.
   * @param {...ConstructorParameters<typeof Item>} args - The arguments to create the items with.
   * @returns {Content} The content.
   */
  push(...args: ConstructorParameters<typeof Item>): this {
    const it = new Item(...args)
    if (!it.scope.length) it.scope.reload(this.scope)
    this.#list.push(it)
    return this
  }

  /**
   * Reloads the content with a new list of items.
   * @param {Item[]} [list=this.#list] - The list of items to reload the content with.
   * @returns {Content} The content.
   */
  reload(list: Item[] = this.#list): this {
    const listResult: Item[] = []
    list.forEach((it) => {
      if (it.is('void')) return
      listResult.push(it)
    })
    this.#list = listResult
    return this
  }

  /**
   * Removes and returns the first item in the content.
   * @returns {Item} The first item in the content, or a new item if the content is empty.
   */
  shift(): Item {
    return this.#list.shift() ?? new Item()
  }

  /**
   * Adds one or more items to the beginning of the content.
   * @param {...ConstructorParameters<typeof Item>} args - The arguments to create the items with.
   * @returns {Content} The content.
   */
  unshift(...args: ConstructorParameters<typeof Item>): this {
    const it = new Item(...args)
    if (!it.scope.length) it.scope.reload(this.scope)
    this.#list.unshift(it)
    return this
  }
}

export default Content
