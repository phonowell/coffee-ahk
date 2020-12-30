import { Context } from '../../type'
import Item from '../../module/item'

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  let flag = false

  const listContent: Item[] = []
  content.list.forEach(item => {

    if (flag && Item.equal(item, 'new-line')) {
      flag = false
      const _scope: Item['scope'] = [...item.scope, 'call']
      listContent.push(Item.new('edge', 'call-start', _scope))
      listContent.push(Item.new('edge', 'call-end', _scope))
      listContent.push(item)
      return
    }

    if (!Item.equal(item, 'origin', '__mark:do__')) {
      listContent.push(item)
      return
    }

    flag = true
  })

  content.load(listContent)
}

// export
export default main
