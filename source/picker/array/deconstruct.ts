import { Context } from '../../entry/type'
import Item from '../../module/Item'

// function

const main = (ctx: Context): void => {
  const { content } = ctx

  let listPre: Item[][] = []
  const token = '__array__'
  let listContent: typeof content.list = []

  const pickIndent = (i: number): number => {
    const it = content.eq(i)
    if (!it) return 0
    if (it.type === 'new-line') return parseInt(it.value, 10)
    return pickIndent(i - 1)
  }

  const pickPre = (i: number, listResult: Item[][] = [[]]): Item[][] => {
    const it = content.eq(i)
    const last = listResult[listResult.length - 1]

    if (Item.is(it, 'edge', 'array-start')) return listResult

    if (Item.is(it, 'sign', ',')) listResult.push([])
    else last.unshift(it)

    listContent.pop()
    return pickPre(i - 1, listResult)
  }

  // each
  content.list.forEach((item, i) => {
    // output
    if (listPre.length && item.type === 'new-line') {
      const indent = pickIndent(i - 1)

      listPre.forEach(
        (_, j) =>
          (listContent = [
            ...listContent,
            // \n xxx = token[n]
            ...[
              ['new-line', indent.toString()],
              ...listPre[listPre.length - j - 1].map(it => [it.type, it.value]),
              ['sign', '='],
              ['identifier', token],
              ['edge', 'index-start'],
              ['number', (j + 1).toString()],
              ['edge', 'index-end'],
            ].map(args =>
              Item.new(args[0] as Item['type'], args[1], item.scope)
            ),
          ])
      )

      listPre.length = 0
      listContent.push(item)
      return
    }

    // find
    if (!Item.is(item, 'sign', '=')) {
      listContent.push(item)
      return
    }
    if (!Item.is(content.eq(i - 1), 'edge', 'array-end')) {
      listContent.push(item)
      return
    }

    // pick
    // why i - 2
    // [xxx] = [xxx]
    //    ^1 ^2
    // 1 is what you need, and 2 is where you are, so minus 2
    listPre = pickPre(i - 2)
    listContent = listContent.slice(0, listContent.length - 2)

    listContent = [
      ...listContent,
      Item.new('identifier', token, item.scope),
      Item.new('sign', '=', item.scope),
    ]
  })

  // reload
  content.load(listContent)
}

// export
export default main
