import { Context } from '../../types'
import Item from '../../module/Item'

// function

const main = (ctx: Context, listFn: Set<string>): void => {
  // replace const as parameter =
  // from `fn(callback)` to `fn(Func('callback'))`
  replaceFn(ctx, listFn)
}

const replaceFn = (ctx: Context, listFn: Set<string>): void => {
  const { content } = ctx

  content.list.forEach((it, i) => {
    if (it.type !== 'identifier') return
    if (it.scope[it.scope.length - 1] !== 'call') return
    if (!listFn.has(it.value)) return
    if (Item.is(content.eq(i + 1), 'edge', 'call-start')) return

    it.type = 'native'
    it.value = `Func("${it.value}")`
  })
}

// export
export default main
