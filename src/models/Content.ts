import at from '../utils/at'

import Item from './Item'
import Scope from './Scope'

// function

class Content {
  #list: Item[] = []
  scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }

  get last() {
    return this.at(-1) ?? new Item()
  }

  get length() {
    return this.#list.length
  }

  get list() {
    return [...this.#list]
  }

  at(n: number) {
    return at(this.#list, n)
  }

  pop() {
    return this.#list.pop() ?? new Item()
  }

  push(...args: ConstructorParameters<typeof Item>) {
    const it = new Item(...args)
    if (!it.scope.length) it.scope.reload(this.scope)
    this.#list.push(it)
    return this
  }

  reload(list: Item[] = this.#list) {
    const listResult: Item[] = []
    list.forEach(it => {
      if (it.is('void')) return
      listResult.push(it)
    })
    this.#list = listResult
    return this
  }

  shift() {
    return this.#list.shift() ?? new Item()
  }

  unshift(...args: ConstructorParameters<typeof Item>) {
    const it = new Item(...args)
    if (!it.scope.length) it.scope.reload(this.scope)
    this.#list.unshift(it)
    return this
  }
}

// export
export default Content
