// interface

import { Context } from '../../entry/type'

// function

const main = (
  ctx: Context
): Set<string> => {

  const { content } = ctx
  const listFn = new Set<string>()

  content.list.forEach(item => {
    if (item.type !== 'function') return
    listFn.add(item.value)
  })

  return listFn
}

// export
export default main