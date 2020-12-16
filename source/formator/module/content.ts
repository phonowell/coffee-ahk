import Item from './item'
import scope from './scope'

// function

class Content {

  list: Item[] = []

  get last(): Item {
    return this.eq(-1)
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
    ) || this.new('void')
  }

  equal(
    item: Item,
    type: string,
    value?: string
  ): boolean {
    if (!(item instanceof Item)) return false
    if (typeof value === 'undefined')
      return item.type === type
    return item.type === type && item.value === value
  }

  isItem(
    input: unknown
  ): boolean {

    return input instanceof Item
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

  new(
    ...arg: ConstructorParameters<typeof Item> | Parameters<typeof Item['clone']>
  ): Item {

    if (arg[0] instanceof Item)
      return Item.clone(arg[0])

    if (typeof arg[0] === 'string')
      return new Item(...arg as ConstructorParameters<typeof Item>)

    throw new Error(`invalid item: ${JSON.stringify(arg)}`)
  }

  pop(): Item {
    return this.list.pop() || this.new()
  }

  push(
    ...arg: Parameters<Content['new']>
  ): this {

    const it = this.new(...arg)
    if (!it.scope.length)
      it.scope = scope.clone()
    this.list.push(it)
    return this
  }

  shift(): Item {
    return this.list.shift() || this.new()
  }

  unshift(
    ...arg: Parameters<Content['new']>
  ): this {

    const it = this.new(...arg)
    if (!it.scope.length)
      it.scope = [...scope.list]
    this.list.unshift(it)
    return this
  }
}

// export
export default new Content()