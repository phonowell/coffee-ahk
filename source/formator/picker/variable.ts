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

  prependSystemVariable(ctx)
}

function prependSystemVariable(
  ctx: Context
): void {

  const { content } = ctx

  function findFirst(
    i: number = 0
  ): number {

    const it = content.eq(i)
    if (!it) return 0
    if (it.type === 'identifier' && it.value.startsWith('global ')) return i
    return findFirst(i + 1)
  }

  const index = findFirst()
  const listContent = [...content.list]

  listContent.splice(index, 0, ...[
    content.new('identifier', `global __ctx_${ctx.option.salt}__`, []),
    content.new('sign', '=', []),
    content.new('bracket', '{', []),
    content.new('bracket', '}', []),
    content.new('new-line', '0', [])
  ])

  content.load(listContent)
}

// export
export default main