// interface

import { Context } from '../type'
type Item = Context['content']['list'][number]

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  // global
  if (ctx.option.insertGlobalThis)
    content.list.unshift(
      content.new('origin', 'global ', []),
      content.new('identifier', 'globalThis', []),
      content.new('sign', '=', []),
      content.new('bracket', '{', []),
      content.new('bracket', '}', []),
      content.new('new-line', '0', [])
    )

  // global
  content.list.forEach(item => {

    if (!content.equal(item, 'identifier', 'globalThis')) return
    item.value = `__globalThis_${ctx.option.salt}__`
  })

  // new Error -> Exception
  let listContent: Item[] = []
  content.list.forEach((item, i) => {

    if (!content.equal(item, 'statement', 'new')) {
      listContent.push(item)
      return
    }

    const it = content.eq(i + 1)
    if (!content.equal(it, 'identifier', 'Error')) {
      listContent.push(item)
      return
    }

    it.value = 'Exception'
  })
  content.load(listContent)
}

// export
export default main