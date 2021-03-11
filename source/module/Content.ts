import Item from './Item'
import scope from './Scope'

// function

class Content {

  list: Item[] = []

  get last(): Item {
    return this.eq(-1)
  }

  load(
    list: Item[] = this.list
  ): this {

    const listResult: Item[] = []
    list.forEach(it => {
      if (it.type === 'void') return
      listResult.push(it)
    })
    this.list = listResult
    return this
  }

  clear(): this {
    this.list = []
    return this
  }

  clone(): Item[] {
    return [...this.list]
  }

  eq(
    n: number
  ): Item {

    return (
      n >= 0
        ? this.list[n]
        : this.list[this.list.length + n]
    )
  }

  pop(): Item {
    return this.list.pop() || Item.new()
  }

  push(
    ...args: Parameters<typeof Item['new']>
  ): this {

    const it = Item.new(...args)
    if (!it.scope.length)
      it.scope = scope.clone()
    this.list.push(it)
    return this
  }

  shift(): Item {
    return this.list.shift() || Item.new()
  }

  unshift(
    ...args: Parameters<typeof Item['new']>
  ): this {

    const it = Item.new(...args)
    if (!it.scope.length)
      it.scope = [...scope.list]
    this.list.unshift(it)
    return this
  }
}

// export
export default new Content()