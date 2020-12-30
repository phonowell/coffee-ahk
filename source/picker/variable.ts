import { Context } from '../entry/type'
import Item from '../module/Item'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  const cacheVariable: Set<string> = new Set()

  // global
  content.list.forEach((item, i) => {

    if (!Item.equal(item, 'sign', '=')) return

    const it = content.eq(i - 1)
    if (it.type !== 'identifier') return
    if (it.scope.length) return
    if (content.eq(i - 2).type !== 'new-line') return

    if (cacheVariable.has(it.value)) return
    cacheVariable.add(it.value)
    it.value = `global ${it.value}`
  })

  // new Error -> Exception
  const listContent: Item[] = []
  content.list.forEach((item, i) => {

    if (!Item.equal(item, 'statement', 'new')) {
      listContent.push(item)
      return
    }

    const it = content.eq(i + 1)
    if (!Item.equal(it, 'identifier', 'Error')) {
      listContent.push(item)
      return
    }

    it.value = 'Exception'
  })
  content.load(listContent)
}

// export
export default main
