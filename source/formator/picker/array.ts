// interface

import { Context } from '../type'

type Item = Context['content']['list'][number]

type Range = [number, number]

// function

function changeIndex(
  ctx: Context
): void {

  const { content } = ctx

  const listCache: {
    range: Range
    list: Item[]
  }[] = []

  function pickItem(
    item: Item,
    i: number,
    listResult: Item[] = []
  ): [number, Item[]] {

    const it = content.eq(i)
    if (!it) return [i, listResult]

    listResult.unshift(it)

    if (
      content.equal(it, 'edge', 'index-start')
      && it.scope.join('|') === item.scope.join('|')
    ) return [i, listResult]

    return pickItem(item, i - 1, listResult)
  }

  // each
  content.list.forEach((item, i) => {

    if (!content.equal(item, 'edge', 'index-end')) return

    const [iStart, listItem] = pickItem(item, i)
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
      listCache.push({
        range: [iStart + 1, i - 1],
        list: [
          content.new(
            'identifier',
            `__change_index_${ctx.option.salt}__`,
            _scope
          ),
          content.new('edge', 'call-start', _scopeCall),
          ...list,
          content.new('edge', 'call-end', _scopeCall),
        ]
      })
      return
    }

    if (type === 'number') {

      const _scope = listUnwrap[0].scope
      let list: Item[] = []

      if (listUnwrap.length === 1) {
        const it = listUnwrap[0]
        it.value = (parseInt(it.value) + 1).toString()
        list = [it]
      } else {
        list = [
          listUnwrap[listUnwrap.length - 1],
          content.new('math', '+', _scope),
          content.new('number', '1', _scope)
        ]
      }

      listCache.push({
        range: [i - 1, i - 1],
        list
      })
      return
    }
  })

  if (listCache.length) {
    listCache.reverse()
    const listContent: Item[] = [...content.list]
    listCache.forEach(it => listContent.splice(
      it.range[0], it.range[1] - it.range[0] + 1,
      ...it.list
    ))
    content.load(listContent)
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
    if (it.type === 'new-line') return parseInt(it.value)
    return pickIndent(i - 1)
  }

  function pickPre(
    i: number
  ): void {
    const it = content.eq(i)
    if (content.equal(it, 'edge', 'array-start')) return
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

      for (let i = 0; i < listPre.length; i++) {
        listContent = [
          ...listContent,
          // \n xxx = token[n]
          content.new('new-line', indent.toString(), _scope),
          content.new('identifier', listPre[listPre.length - i - 1], _scope),
          content.new('sign', '=', _scope),
          content.new('identifier', token, _scope),
          content.new('edge', 'index-start', _scope),
          content.new('number', (i + 1).toString(), _scope),
          content.new('edge', 'index-end', _scope)
        ]
      }

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!content.equal(item, 'sign', '=')) {
      listContent.push(item)
      return
    }
    if (!content.equal(content.eq(i - 1), 'edge', 'array-end')) {
      listContent.push(item)
      return
    }

    // pick
    pickPre(i)

    listContent = [
      ...listContent,
      content.new('identifier', token, item.scope),
      content.new('sign', '=', item.scope)
    ]
  })

  // reload
  content.load(listContent)
}

function main(
  ctx: Context
): void {

  // const { content } = ctx

  // never use array[0]
  // content.list.forEach((it, i) => {
  //   if (!content.equal(it, 'edge', 'index-start')) return
  //   if (!content.equal(content.eq(i + 1), 'number', '0')) return
  //   if (!content.equal(content.eq(i + 2), 'edge', 'index-end')) return
  //   throw new Error("ahk/forbidden: 'Array[0]' is not allowed, Array of ahk is beginning from '1'")
  // })

  // list[0] -> list[1]
  changeIndex(ctx)

  // deconstruction
  // [a, b] = [1, 2]
  deconstruct(ctx)
}

// export
export default main