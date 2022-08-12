import { Context } from '../../entry/type'
import Item from '../../module/Item'

// function

const main = (ctx: Context): void => {
  const { content } = ctx

  content.list.forEach((item, i) => {
    if (!Item.is(item, 'edge', 'parameter-start')) return

    const it = content.eq(i - 1)
    if (it.type !== 'identifier') return

    it.type = 'function'
  })
}

// export
export default main
