import type Item from '../models/Item'
import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    const flag = (() => {
      if (!item.is('new-line')) return false

      if (!(i > 0)) return false

      const prev = content.at(i - 1)
      if (!prev) return false
      if (prev.is('bracket', '(')) return true
      if (prev.is('sign', '=')) return true

      return false
    })()

    if (!flag) listContent.push(item)
  })

  // reload
  content.reload(listContent)
}

export default main
