import { Context } from '../../type'
import Item from '../../module/item'

// function

function main(
  ctx: Context,
  listFn: Set<string>
): void {

  // replace function as parameter
  // from `fn(callback)` to `fn(Func('callback'))`
  replaceFn(ctx, listFn)
}

function replaceFn(
  ctx: Context,
  listFn: Set<string>
): void {

  const { content } = ctx

  content.list.forEach((it, i) => {

    if (it.type !== 'identifier') return
    if (it.scope[it.scope.length - 1] !== 'call') return
    if (!listFn.has(it.value)) return
    if (Item.equal(content.eq(i + 1), 'edge', 'call-start')) return

    it.type = 'origin'
    it.value = `Func("${it.value}")`
  })
}

// export
export default main
