import type { Context } from '../../types'

const main = (ctx: Context, listFn: Set<string>) => {
  // replace const as parameter =
  // from `fn(callback)` to `fn(Func('callback'))`
  replaceFn(ctx, listFn)
}

const replaceFn = (ctx: Context, listFn: Set<string>) => {
  const { content } = ctx

  content.toArray().forEach((it, i) => {
    if (it.type !== 'identifier') return
    if (it.scope.at(-1) !== 'call') return
    if (!listFn.has(it.value)) return
    if (content.at(i + 1)?.is('edge', 'call-start')) return

    it.type = 'native'
    it.value = `Func("${it.value}")`
  })
}

export default main
