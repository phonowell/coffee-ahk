import { Context } from '../../entry/type'
import Item from '../../module/Item'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx
  const cache: Set<string> = new Set()
  let flagIgnore = 0

  const listContent: Item[] = []

  content.list.forEach((item, i) => {

    if (flagIgnore) {
      flagIgnore--
      return
    }

    listContent.push(item)

    if (!Item.equal(item, 'sign', '=')) return

    const prev = content.eq(i - 1)
    if (prev.type !== 'identifier') return
    if (prev.scope.length) return
    if (content.eq(i - 2).type !== 'new-line') return

    if (cache.has(prev.value)) return
    cache.add(prev.value)

    if (
      Item.equal(content.eq(i + 1), 'identifier', prev.value)
      && content.eq(i + 2).type === 'new-line'
    ) {
      listContent.splice(
        listContent.length - 2, 2
      )
      flagIgnore = 2
      return
    }

    listContent.splice(
      listContent.length - 2, 0,
      Item.new('origin', 'global ', item.scope),
    )
  })

  content.load(listContent)
  ctx.cache.global = cache
}

// export
export default main
