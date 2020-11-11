// interface

import { Context } from '../../type'

// function

function main(
  ctx: Context
): Set<string> {

  const { content } = ctx
  const listFn: Set<string> = new Set()

  content.list.forEach(item => {
    if (item.type !== 'function') return
    listFn.add(item.value)
  })

  return listFn
}

// export
export default main