import { Context } from '../../entry/type'
import Item from '../../module/Item'

// function

const main = (
  ctx: Context
): void => {

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