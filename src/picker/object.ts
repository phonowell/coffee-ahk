import Item from '../models/Item.js'

import type { Context } from '../types'

const deconstruct = (ctx: Context) => {
  const { content } = ctx

  const listPre: string[] = []
  const token = '__object__'
  let listContent: Item[] = []

  const pickIndent = (i: number): number => {
    const it = content.at(i)
    if (!it) return 0
    if (it.type === 'new-line') return parseInt(it.value, 10)
    return pickIndent(i - 1)
  }

  const pickPre = (i: number) => {
    const it = content.at(i)
    if (!it) return
    if (it.is('bracket', '{')) return
    if (it.is('identifier')) listPre.push(it.value)
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
          new Item('new-line', indent.toString(), _scope),
          new Item('identifier', listPre[listPre.length - j - 1], _scope),
          new Item('sign', '=', _scope),
          new Item('identifier', token, _scope),
          new Item('edge', 'index-start', _scope),
          new Item('string', `"${listPre[listPre.length - j - 1]}"`, _scope),
          new Item('edge', 'index-end', _scope),
        ]
      }

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!item.is('sign', '=')) {
      listContent.push(item)
      return
    }
    if (!content.at(i - 1)?.is('bracket', '}')) {
      listContent.push(item)
      return
    }

    // pick
    pickPre(i)

    listContent = [
      ...listContent,
      new Item('identifier', token, item.scope),
      new Item('sign', '=', item.scope),
    ]
  })

  // reload
  content.reload(listContent)
}

const deconstruct2 = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (!item.is('identifier')) return
    if (item.scope.at(-1) !== 'object') return

    const prev = content.at(i - 1)
    if (!prev) return
    if (!(prev.is('bracket', '{') || prev.is('sign', ','))) return

    const next = content.at(i + 1)
    if (!next) return
    if (!(next.is('bracket', '}') || next.is('sign', ','))) return

    listContent.push(
      new Item('sign', ':', item.scope.list),
      new Item('identifier', item.value, item.scope.list),
    )
  })

  // reload
  content.reload(listContent)
}

const main = (ctx: Context) => {
  // deconstruction
  deconstruct(ctx)
  deconstruct2(ctx)
}

export default main
