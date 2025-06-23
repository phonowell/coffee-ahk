// Arrow function handling
import Item from '../../models/Item.js'

import type Scope from '../../models/Scope'
import type { Context } from '../../types'

const findEdge = (ctx: Context, i: number = ctx.content.length - 1): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0

  if (it.is('edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

export const arrow = (ctx: Context, type: string) => {
  const { content, scope } = ctx

  // fn = -> xxx
  if (!content.last.is('edge', 'parameter-end')) {
    if (!content.at(-2)?.is('property', 'constructor'))
      content.push('identifier', 'anonymous')

    scope.push('parameter')
    content.push('edge', 'parameter-start')

    if (type === '=>') content.push('this').push('sign', '=').push('this')

    content.push('edge', 'parameter-end')
    scope.pop()
  } else if (type === '=>') {
    const scp2: Scope['list'] = [...scope.list, 'parameter']
    content.list.splice(
      findEdge(ctx) + 1,
      0,
      new Item('this', 'this', scp2),
      new Item('sign', '=', scp2),
      new Item('this', 'this', scp2),
      new Item('sign', ',', scp2),
    )
  }

  scope.push('function')
  return true
}
