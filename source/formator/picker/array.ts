// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  // never use array[0]
  content.list.forEach((it, i) => {
    if (!content.equal(it, 'edge', 'index-start')) return
    if (!content.equal(content.eq(i + 1), 'number', '0')) return
    if (!content.equal(content.eq(i + 2), 'edge', 'index-end')) return
    throw new Error("ahk/forbidden: 'Array[0]' is not allowed, Array of ahk is beginning from '1'")
  })

  // [a, b] = [1, 2]
  transPair(ctx)
}

function transPair(
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
  ) {
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
      const scope = item.scope

      for (let i = 0; i < listPre.length; i++) {
        listContent = [
          ...listContent,
          // \n xxx = token[n]
          content.new('new-line', indent.toString(), scope),
          content.new('identifier', listPre[listPre.length - i - 1], scope),
          content.new('sign', '=', scope),
          content.new('identifier', token, scope),
          content.new('edge', 'index-start', scope),
          content.new('number', (i + 1).toString(), scope),
          content.new('edge', 'index-end', scope)
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

// export
export default main