import { Context } from '../types'
import Item from '../module/Item'

// function

const main = (ctx: Context): void => {
  const { content } = ctx

  const listContent: Item[] = []

  // each
  content.list.forEach((item, i) => {
    const flag = (() => {
      if (!Item.is(item, 'new-line')) return false

      if (!(i > 0)) return false

      const prev = content.eq(i - 1)
      if (Item.is(prev, 'bracket', '(')) return true
      if (Item.is(prev, 'sign', '=')) return true

      return false
    })()

    if (!flag) {
      listContent.push(item)
      return
    }

    return
  })

  // reload
  content.load(listContent)
}

// export
export default main
