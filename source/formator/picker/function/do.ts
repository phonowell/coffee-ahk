// interface

import { Context } from '../../type'
type Item = Context['content']['list'][number]

// function

function main(
  ctx: Context
): void {

  const { content } = ctx

  let flag = false

  const listContent: Item[] = []
  content.list.forEach(item => {

    if (flag && content.equal(item, 'new-line')) {
      flag = false
      const _scope: Item['scope'] = [...item.scope, 'call']
      listContent.push(content.new('edge', 'call-start', _scope))
      listContent.push(content.new('edge', 'call-end', _scope))
      listContent.push(item)
      return
    }

    if (!content.equal(item, 'origin', '__mark:do__')) {
      listContent.push(item)
      return
    }

    flag = true
  })

  content.load(listContent)
}

// export
export default main