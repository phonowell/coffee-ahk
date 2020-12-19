// interface

import { Context } from '../type'
type Item = Context['content']['list'][number]

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  const cacheVariable: Set<string> = new Set()

  // global
  if (ctx.option.autoGlobal)
    content.list.forEach((item, i) => {

      if (!content.equal(item, 'sign', '=')) return

      const it = content.eq(i - 1)
      if (it.type !== 'identifier') return
      if (it.scope.length) return
      if (content.eq(i - 2).type !== 'new-line') return

      if (cacheVariable.has(it.value)) return
      cacheVariable.add(it.value)
      it.value = `global ${it.value}`
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