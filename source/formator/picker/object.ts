// interface

import { Context } from '../type'

// function

function deconstruct(
  ctx: Context
): void {

  const { content } = ctx

  const listPre: string[] = []
  const token = '__object__'
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
    if (content.equal(it, 'bracket', '{')) return
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
          // \n xxx = token[xxx]
          content.new('new-line', indent.toString(), _scope),
          content.new('identifier', listPre[listPre.length - i - 1], _scope),
          content.new('sign', '=', _scope),
          content.new('identifier', token, _scope),
          content.new('edge', 'index-start', _scope),
          content.new('string', `"${listPre[listPre.length - i - 1]}"`, _scope),
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
    if (!content.equal(content.eq(i - 1), 'bracket', '}')) {
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

  // deconstruction
  deconstruct(ctx)
}

// export
export default main