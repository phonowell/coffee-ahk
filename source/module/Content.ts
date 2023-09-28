import at from '../utils/at'

import Item from './Item'
import scope from './Scope'

// function

class Content {
  list: Item[] = []

  get last() {
    return this.eq(-1) ?? Item.new()
  }

  load(list: Item[] = this.list) {
    const listResult: Item[] = []
    list.forEach(it => {
      if (it.type === 'void') return
      listResult.push(it)
    })
    this.list = listResult
    return this
  }

  clear() {
    this.list = []
    return this
  }

  clone() {
    return [...this.list]
  }

  eq(n: number) {
    return at(this.list, n)
  }

  pop() {
    return this.list.pop()
  }

  push(...args: Parameters<(typeof Item)['new']>) {
    const it = Item.new(...args)
    if (!it.scope.length) it.scope = scope.clone()
    this.list.push(it)
    return this
  }

  shift() {
    return this.list.shift()
  }

  unshift(...args: Parameters<(typeof Item)['new']>) {
    const it = Item.new(...args)
    if (!it.scope.length) it.scope = [...scope.list]
    this.list.unshift(it)
    return this
  }
}

// export
const content = new Content()
export default content
