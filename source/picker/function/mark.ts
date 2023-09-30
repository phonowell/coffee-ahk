import { Context } from '../../types'
import Item from '../../module/Item'

// function

const main = (ctx: Context) => {
  const { content } = ctx

  content.list.forEach((item, i) => {
    if (!Item.is(item, 'edge', 'parameter-start')) return

    const it = content.at(i - 1)
    if (!Item.is(it, 'identifier')) return

    it.type = 'function'
  })
}

// export
export default main
