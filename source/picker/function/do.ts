import { Context } from '../../entry/type'
import Item from '../../module/Item'

// function

const main = (ctx: Context): void => {
  const { content } = ctx

  let flag = false

  const listContent: Item[] = []
  content.list.forEach(item => {
    if (flag && Item.is(item, 'new-line')) {
      flag = false
      const _scope: Item['scope'] = [...item.scope, 'call']
      listContent.push(
        // add `()` for type-checking
        Item.new('bracket', ')', item.scope),
        Item.new('edge', 'call-start', _scope),
        Item.new('edge', 'call-end', _scope),
        item
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
