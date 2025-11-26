// Instanceof processor: converts identifier after instanceof-class marker to string
import Item from '../models/Item.js'

import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const listContent: Item[] = []

  content.toArray().forEach((item, i) => {
    // Skip marker
    if (item.is('edge', 'instanceof-class')) return

    // Convert identifier after marker to string literal
    const prev = content.at(i - 1)
    if (prev?.is('edge', 'instanceof-class') && item.type === 'identifier') {
      listContent.push(new Item('string', `"${item.value}"`, item.scope))
      return
    }

    listContent.push(item)
  })

  content.reload(listContent)
}

export default main
