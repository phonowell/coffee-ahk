/* eslint-disable @typescript-eslint/prefer-optional-chain */
import type Item from '../../models/Item.js'
import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    // Handle Promise constructor and static methods
    if (item.is('identifier', 'Promise'))
      handlePromiseIdentifier(content.list, i)

    // Handle Promise method calls (.then, .catch, .finally)
    if (isPromiseMethod(item, content.list, i)) handlePromiseMethod(item)
  })

  content.reload(listContent)
}

const handlePromiseIdentifier = (list: Item[], index: number) => {
  const nextItem = list[index + 1]
  const prevItem = list[index - 1]

  // Handle Promise constructor: new Promise(...)
  if (prevItem && prevItem.is('statement', 'new')) return

  // Handle Promise static methods
  if (nextItem && nextItem.is('.')) {
    const methodItem = list[index + 2]
    if (methodItem && methodItem.is('identifier')) {
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
    prevItem &&
    prevItem.is('.')
  )
}

const handlePromiseMethod = (item: Item) => item

export default main
