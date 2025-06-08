import type Item from '../../models/Item'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const listContent: Item[] = []

  content.list.forEach((item, i) => {
    if (!item.is('statement', 'new')) {
      listContent.push(item)
      return
    }

    const next = content.at(i + 1)
    if (!next?.is('identifier', 'Error')) {
      listContent.push(item)
      return
    }

    next.value = 'Exception'
  })

  content.reload(listContent)
}

export default main
