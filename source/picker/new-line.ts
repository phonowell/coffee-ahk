import { Context } from '../types'
import Item from '../module/Item'

// function

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    const flag = (() => {
      if (!Item.is(item, 'new-line')) return false

      if (!(i > 0)) return false

      const prev = content.at(i - 1)
      if (Item.is(prev, 'bracket', '(')) return true
      if (Item.is(prev, 'sign', '=')) return true

      return false
    })()

    if (!flag) listContent.push(item)
  })

  // reload
  content.load(listContent)
}

// export
export default main
