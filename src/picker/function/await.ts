import Item from '../../models/Item.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    // Handle await keyword - mark the containing function as async
    if (item.type === 'await') {
      // Find the containing function and mark it as async
      markContainingFunctionAsAsync(ctx, item, i)
    }
  })

  content.reload(listContent)
}

const markContainingFunctionAsAsync = (
  ctx: Context,
  awaitItem: Item,
  index: number,
) => {
  const { content } = ctx

  // Find the containing function scope
  const functionScope = awaitItem.scope.list.find(
    (scope) => scope === 'function',
  )
  if (!functionScope) return

  // Find the function definition and mark it as async
  for (let i = index - 1; i >= 0; i--) {
    const item = content.list[i]
    if (
      item.is('edge', 'parameter-start') &&
      item.scope.list.includes('function')
    ) {
      // Found function start, now find the arrow operator
      for (let j = i; j < content.list.length; j++) {
        const nextItem = content.list[j]
        if (nextItem.is('native') && ['->', '=>'].includes(nextItem.value)) {
          // Mark this function as async by adding async keyword before it
          const asyncItem = new Item('async', 'async', nextItem.scope)
          content.list.splice(j, 0, asyncItem)
          return
        }
      }
      break
    }
  }
}

export default main
