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
  let indent = 0
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
  content.list.forEach((it, i) => {

    // output
    if (it.type === 'new-line' && listPre.length) {
      for (let i = 0; i < listPre.length; i++) {
        listContent = [
          ...listContent,
          // \n xxx = token[n]
          content.make('new-line', indent.toString(), it.scope),
          content.make('identifier', listPre[listPre.length - i - 1], it.scope),
          content.make('sign', '=', it.scope),
          content.make('identifier', token, it.scope),
          content.make('edge', 'index-start', it.scope),
          content.make('number', (i + 1).toString(), it.scope),
          content.make('edge', 'index-end', it.scope)
        ]
      }

      indent = 0
      listPre.length = 0
      listContent.push(it)
      return
    }

    // find
    if (!content.equal(it, 'sign', '=')) {
      listContent.push(it)
      return
    }
    if (!content.equal(content.eq(i - 1), 'edge', 'array-end')) {
      listContent.push(it)
      return
    }

    // pick
    indent = pickIndent(i)
    pickPre(i)

    listContent = [
      ...listContent,
      content.make('identifier', token, it.scope),
      content.make('sign', '=', it.scope)
    ]
  })

  // reload
  content.load(listContent)
}

// export
export default main