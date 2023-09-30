import { Context } from '../../types'
import Item from '../../module/Item'

// function

const main = (ctx: Context) => {
  const { content } = ctx
  const listContent: Item[] = []

  content.list.forEach((item, i) => {
    if (!Item.is(item, 'statement', 'new')) {
      listContent.push(item)
      return
    }

    const it = content.at(i + 1)
    if (!Item.is(it, 'identifier', 'Error')) {
      listContent.push(item)
      return
    }

    it.value = 'Exception'
  })

  content.load(listContent)
}

// export
export default main
