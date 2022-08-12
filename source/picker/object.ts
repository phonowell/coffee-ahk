import { Context } from '../entry/type'
import Item from '../module/Item'

// function

const deconstruct = (ctx: Context): void => {
  const { content } = ctx

  const listPre: string[] = []
  const token = '__object__'
  let listContent: typeof content.list = []

  const pickIndent = (i: number): number => {
    const it = content.eq(i)
    if (!it) return 0
    if (it.type === 'new-line') return parseInt(it.value, 10)
    return pickIndent(i - 1)
  }

  const pickPre = (i: number): void => {
    const it = content.eq(i)
    if (Item.is(it, 'bracket', '{')) return
    if (it.type === 'identifier') listPre.push(it.value)
    listContent.pop()
    pickPre(i - 1)
  }

  // each
  content.list.forEach((item, i) => {
    // output
    if (listPre.length && item.type === 'new-line') {
      const indent = pickIndent(i - 1)
      const _scope = item.scope

      for (let j = 0; j < listPre.length; j++) {
        listContent = [
          ...listContent,
          // \n xxx = token[xxx]
          Item.new('new-line', indent.toString(), _scope),
          Item.new('identifier', listPre[listPre.length - j - 1], _scope),
          Item.new('sign', '=', _scope),
          Item.new('identifier', token, _scope),
          Item.new('edge', 'index-start', _scope),
          Item.new('string', `"${listPre[listPre.length - j - 1]}"`, _scope),
          Item.new('edge', 'index-end', _scope),
        ]
      }

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!Item.is(item, 'sign', '=')) {
      listContent.push(item)
      return
    }
    if (!Item.is(content.eq(i - 1), 'bracket', '}')) {
      listContent.push(item)
      return
    }

    // pick
    pickPre(i)

    listContent = [
      ...listContent,
      Item.new('identifier', token, item.scope),
      Item.new('sign', '=', item.scope),
    ]
  })

  // reload
  content.load(listContent)
}

const deconstruct2 = (ctx: Context): void => {
  const { content } = ctx

  const listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (!Item.is(item, 'identifier')) return
    if (item.scope[item.scope.length - 1] !== 'object') return

    const prev = content.eq(i - 1)
    if (!(Item.is(prev, 'bracket', '{') || Item.is(prev, 'sign', ','))) return

    const next = content.eq(i + 1)
    if (!(Item.is(next, 'bracket', '}') || Item.is(next, 'sign', ','))) return

    listContent.push(
      new Item('sign', ':', [...item.scope]),
      new Item('identifier', item.value, [...item.scope])
    )
  })

  // reload
  content.load(listContent)
}

const main = (ctx: Context): void => {
  // deconstruction
  deconstruct(ctx)
  deconstruct2(ctx)
}

// export
export default main
