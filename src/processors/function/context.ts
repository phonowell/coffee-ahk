// Main function context processor
import Item from '../../models/Item.js'

import {
  cache,
  getCountIgnore,
  getListContent,
  getListParam,
  insertCache,
  resetCache,
  setCountIgnore,
} from './context/cache.js'
import { pickItem } from './context/utils.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  // reset
  resetCache()

  // each
  content.toArray().forEach((item, i) => {
    const listContent = getListContent()
    const listParam = getListParam()
    const countIgnore = getCountIgnore()

    // ignore
    if (countIgnore) {
      setCountIgnore(countIgnore - 1)
      listContent.push(new Item('void', '', []))
      return
    }

    // cache
    if (listParam.length && item.is('edge', 'block-start')) {
      listContent.push(item)
      cache(ctx, item, i)
      listParam.length = 0
      return
    }

    if (!pick(ctx, item, i)) listContent.push(item)
  })

  // insert
  insertCache()

  const listContent = getListContent()
  content.reload(listContent)
}

const pick = (ctx: Context, item: Item, i: number): boolean => {
  const { content } = ctx

  // find `fn(x = x)`
  //            ^
  if (!item.is('sign', '=')) return false
  if (item.scope.at(-1) !== 'parameter') return false

  const itNext = content.at(i + 1)
  if (!itNext) return false
  if (!['identifier', 'this'].includes(itNext.type)) return false

  const itPrev = content.at(i - 1)
  if (!itPrev) return false
  if (!['identifier', 'this'].includes(itPrev.type)) return false

  // pick
  const listContent = getListContent()
  const listParam = getListParam()

  listContent.push(new Item('void'))
  listParam.push(pickItem(ctx, itNext, i + 1))
  const lastParam = listParam.at(-1)
  setCountIgnore(lastParam?.length ?? 0)
  return true
}

export default main
