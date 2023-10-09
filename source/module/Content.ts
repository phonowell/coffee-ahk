import at from '../utils/at'

import Item from './Item'
import Scope from './Scope'

// function

class Content {
  list: Item[] = []
  scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  /**
   * Returns the last item in the Content, or a new empty Item if the Content is empty.
   * @returns The last item in the Content, or a new empty Item if the Content is empty.
   */
  get last() {
    return this.at(-1) ?? new Item()
  }

  /**
   * Returns the item at the specified index in this content list.
   * @param n The index of the item to retrieve.
   * @returns The item at the specified index.
   */
  at(n: number) {
    return at(this.list, n)
  }

  /**
   * Clears the Content's list of all items.
   * @returns The Content instance with an empty list.
   */
  clear() {
    this.list = []
    return this
  }

  /**
   * Returns a new array containing clones of all items in the Content's list.
   * @returns A new array containing clones of all items in the Content's list.
   */
  clone() {
    return [...this.list]
  }

  /**
   * Removes and returns the last item in the Content's list.
   * @returns The last item in the Content's list.
   */
  pop() {
    return this.list.pop()
  }

  /**
   * Creates a new Item instance with the provided arguments and adds it to the end of the Content's list.
   * If the new item has no scope, sets its scope to a clone of the Content's current scope.
   * @param args The arguments to use when creating the new Item instance.
   * @returns The Content instance with the new item added to its list.
   */
  push(...args: Parameters<(typeof Item)['new']>) {
    const it = new Item(...args)
    if (!it.scope.length) it.scope.reload(this.scope)
    this.list.push(it)
    return this
  }

  /**
   * Removes all void items from the provided list and sets the Content's list to the result.
   * If no list is provided, defaults to using the Content's current list.
   * @param list The list of items to filter.
   * @returns The Content instance with the filtered list.
   */
  reload(list: Item[] = this.list) {
    const listResult: Item[] = []
    list.forEach(it => {
      if (it.is('void')) return
      listResult.push(it)
    })
    this.list = listResult
    return this
  }

  /**
   * Removes and returns the first item in the Content's list.
   * @returns The first item in the Content's list.
   */
  shift() {
    return this.list.shift()
  }

  /**
   * Creates a new Item instance with the provided arguments and adds it to the beginning of the Content's list.
   * If the new item has no scope, sets its scope to a clone of the Content's current scope.
   * @param args The arguments to use when creating the new Item instance.
   * @returns The Content instance with the new item added to the beginning of its list.
   */
  unshift(...args: Parameters<(typeof Item)['new']>) {
    const it = new Item(...args)
    if (!it.scope.length) it.scope.reload(this.scope)
    this.list.unshift(it)
    return this
  }
}

// export
export default Content
