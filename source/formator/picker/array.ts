import { Context } from '../type'
import Item from '../module/item'

// interface

type Range = [number, number]

// function

function changeIndex(
  ctx: Context
): void {

  const { content } = ctx
  const token = `__ci_${ctx.option.salt}__`
  let countIgnore = 0

  // function

  function pickItem(
    item: Item,
    i: number,
    listResult: Item[] = []
  ): [number, Item[]] {

    const it = content.eq(i)
    if (!it) {
      countIgnore = 0
      return [i, listResult]
    }

    listResult.push(it)

    if (
      Item.equal(it, 'edge', 'index-start')
      && it.scope.join('|') === item.scope.join('|')
    ) {
      countIgnore++
      return pickItem(item, i + 1, listResult)
    }

    if (
      Item.equal(it, 'edge', 'index-end')
      && it.scope.join('|') === item.scope.join('|')
    ) {
      countIgnore--
      if (countIgnore === 0)
        return [i, listResult]
      return pickItem(item, i + 1, listResult)
    }

    return pickItem(item, i + 1, listResult)
  }

  function update(
    range: Range,
    list: Item[]
  ): void {

    const listContent: Item[] = [...content.list]
    listContent.splice(
      range[0], range[1] - range[0] + 1,
      ...list
    )
    content.load(listContent)
  }

  // each
  let i = -1
  let len = content.list.length
  while (i < len) {

    i++
    len = content.list.length
    const item = content.eq(i)

    if (!Item.equal(item, 'edge', 'index-start')) continue

    const next = content.eq(i + 1)
    if (Item.equal(next, 'identifier', token)) continue
    if (Item.equal(next, 'edge', 'index-end')) continue

    const [iEnd, listItem] = pickItem(item, i)
    const listUnwrap: Item[] = listItem.slice(1, listItem.length - 1)
    let type: 'identifier' | 'number' | 'string' = 'number'

    for (const it of listUnwrap) {

      if (it.type === 'identifier') {
        type = 'identifier'
        break
      }

      if (it.type === 'string') {
        type = 'string'
        break
      }
    }

    if (type === 'identifier') {

      ctx.flag.isChangeIndexUsed = true // set flag

      const list = [...listUnwrap]
      const _scope = list[0].scope
      const _scopeCall = [..._scope, 'call'] as typeof _scope

      update(
        [i + 1, iEnd - 1],
        [
          Item.new(
            'identifier',
            token,
            _scope
          ),
          Item.new('edge', 'call-start', _scopeCall),
          ...list,
          Item.new('edge', 'call-end', _scopeCall),
        ]
      )

      continue
    }

    if (type === 'number') {

      const _scope = listUnwrap[0].scope
      let list: Item[] = []

      if (listUnwrap.length === 1) {
        const it = listUnwrap[0]
        it.value = (parseInt(it.value, 10) + 1).toString()
        list = [it]
      } else {
        list = [
          listUnwrap[listUnwrap.length - 1],
          Item.new('math', '+', _scope),
          Item.new('number', '1', _scope),
        ]
      }

      update(
        [i + 1, i + 1],
        list
      )

      continue
    }
  }
}

function deconstruct(
  ctx: Context
): void {

  const { content } = ctx

  const listPre: string[] = []
  const token = '__array__'
  let listContent: typeof content.list = []

  function pickIndent(
    i: number
  ): number {
    const it = content.eq(i)
    if (!it) return 0
    if (it.type === 'new-line') return parseInt(it.value, 10)
    return pickIndent(i - 1)
  }

  function pickPre(
    i: number
  ): void {
    const it = content.eq(i)
    if (Item.equal(it, 'edge', 'array-start')) return
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
          // \n xxx = token[n]
          Item.new('new-line', indent.toString(), _scope),
          Item.new('identifier', listPre[listPre.length - j - 1], _scope),
          Item.new('sign', '=', _scope),
          Item.new('identifier', token, _scope),
          Item.new('edge', 'index-start', _scope),
          Item.new('number', (j + 1).toString(), _scope),
          Item.new('edge', 'index-end', _scope),
        ]
      }

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!Item.equal(item, 'sign', '=')) {
      listContent.push(item)
      return
    }
    if (!Item.equal(content.eq(i - 1), 'edge', 'array-end')) {
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

function main(
  ctx: Context
): void {

  // list[0] -> list[1]
  changeIndex(ctx)

  // deconstruction
  // [a, b] = [1, 2]
  deconstruct(ctx)
}

// export
export default main
