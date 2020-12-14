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
      content.new('origin', 'if !(globalThis) {global globalThis := {}}', []),
      content.new('new-line', '0', [])
    )

  // // const cacheVariable: Set<string> = new Set()

  // // global
  // content.list.forEach((item, i) => {

  //   if (!content.equal(item, 'sign', '=')) return

  //   const it = content.eq(i - 1)
  //   if (it.type !== 'identifier') return
  //   if (it.scope.length) return
  //   if (content.eq(i - 2).type !== 'new-line') return

  //   throw new Error("ahk/forbidden: global variables are not allowed to be declared, use 'globalThis' instead")

  //   // if (cacheVariable.has(it.value)) return
  //   // cacheVariable.add(it.value)
  //   // it.value = `global ${it.value}`
  // })

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