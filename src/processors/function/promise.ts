import type Item from '../../models/Item.js'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    // Handle Promise constructor and static methods
    if (item.is('identifier', 'Promise')) {
      ctx.flag.isPromiseUsed = true
      handlePromiseIdentifier(content.list, i)
    }

    // Handle Promise method calls (.then, .catch, .finally)
    if (isPromiseMethod(item, content.list, i)) {
      ctx.flag.isPromiseUsed = true
      handlePromiseMethod(item)
    }

    // Handle await keyword
    if (item.is('await')) ctx.flag.isPromiseUsed = true
  })

  content.reload(listContent)
}

const handlePromiseIdentifier = (list: Item[], index: number) => {
  const nextItem = list[index + 1]
  const prevItem = list[index - 1]

  // Handle Promise constructor: new Promise(...)
  if (prevItem.is('statement', 'new')) return

  // Handle Promise static methods
  if (nextItem.is('.')) {
    const methodItem = list[index + 2]
    if (methodItem.is('identifier')) {
      const method = methodItem.value
      const staticMethods = ['resolve', 'reject', 'all', 'race', 'allSettled']
      if (staticMethods.includes(method)) {
        // This is handled by the default flow
      }
    }
  }
}

const isPromiseMethod = (item: Item, list: Item[], index: number): boolean => {
  const promiseMethods = ['then', 'catch', 'finally']
  const prevItem = list[index - 1]

  return (
    item.is('identifier') &&
    promiseMethods.includes(item.value) &&
    prevItem.is('.')
  )
}

const handlePromiseMethod = (item: Item) => item

export default main
