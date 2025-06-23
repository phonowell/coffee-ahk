// Main implicit parameter processor
import Item from '../../models/Item.js'

import {
  clearCaches,
  getCacheContext,
  getCacheParameter,
  pickContext,
  pickParameter,
} from './implicit-parameter/context.js'
import {
  findFunctionStart,
  removeTrailingComma,
} from './implicit-parameter/utils.js'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {
    listContent.push(item)

    if (!item.is('edge', 'parameter-start')) return
    if (content.at(i - 1)?.is('property', '__New')) return

    const iStart = findFunctionStart(ctx, i)

    clearCaches()
    pickParameter(ctx, i, item)
    pickContext(ctx, iStart, item)

    const cacheContext = getCacheContext()
    const cacheParameter = getCacheParameter()

    cacheContext.forEach((isDefined, name) => {
      if (isDefined) return
      if (cacheParameter.has(name)) return
      if (ctx.cache.global.has(name)) return
      if (name.startsWith('__') && name.endsWith('__')) return // like `__xxx__`
      if (name[0].toLowerCase() !== name[0]) return // like `Xxx`

      listContent.push(
        ...[
          ['identifier', name],
          ['sign', '='],
          ['identifier', name],
          ['sign', ','],
        ].map((args) => new Item(args[0] as Item['type'], args[1], item.scope)),
      )
    })
  })

  content.reload(listContent)

  // (a,)
  removeTrailingComma(ctx)
}

export default main
