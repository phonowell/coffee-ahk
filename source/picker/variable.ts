import { Context } from '../entry/type'
import Item from '../module/Item'

// function

function boostGlobal(
  ctx: Context
): void {

  const { content } = ctx
  const cache: Set<string> = new Set()

  const listContent: Item[] = []

  content.list.forEach((item, i) => {

    listContent.push(item)

    if (!Item.equal(item, 'sign', '=')) return

    const prev = content.eq(i - 1)
    if (prev.type !== 'identifier') return
    if (prev.scope.length) return
    if (content.eq(i - 2).type !== 'new-line') return

    if (cache.has(prev.value)) return
    cache.add(prev.value)

    listContent.splice(
      listContent.length - 2, 0,
      Item.new('origin', 'global ', item.scope),
    )
  })

  content.load(listContent)
  ctx.cache.global = cache
}

function main(
  ctx: Context
): void {

  // global
  boostGlobal(ctx)

  // new Error -> Exception
  translateError(ctx)
}

function translateError(
  ctx: Context
): void {

  const { content } = ctx
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
