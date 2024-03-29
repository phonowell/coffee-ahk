import { Context } from '../../types'
import Item, { Scope } from '../../module/Item'

// function

const main = (ctx: Context) => {
  const { content } = ctx

  let flag = false

  const listContent: Item[] = []
  content.list.forEach(item => {
    if (
      flag &&
      (Item.is(item, 'new-line') ||
        Item.is(item, 'bracket', '}') ||
        Item.is(item, 'bracket', ')'))
    ) {
      flag = false
      const scope2: Scope[] = [...item.scope, 'call']
      listContent.push(
        // add `()` for type-checking
        Item.new('bracket', ')', item.scope),
        Item.new('edge', 'call-start', scope2),
        Item.new('edge', 'call-end', scope2),
        item,
      )
      return
    }

    if (!Item.is(item, 'native', '__mark:do__')) {
      listContent.push(item)
      return
    }

    flag = true

    // add `()` for type-checking
    listContent.push(Item.new('bracket', '(', item.scope))
  })

  content.load(listContent)
}

// export
export default main
