import { Context } from '../../entry/type'
import Item from '../../module/Item'

// variable

const cacheContext: Map<string, boolean> = new Map()
const cacheParameter: Set<string> = new Set()

// function

function findFunctionStart(
  ctx: Context,
  i: number,
): number {

  const { content } = ctx
  const it = content.eq(i)

  if (Item.equal(it, 'edge', 'block-start')) return i

  return findFunctionStart(ctx, i + 1)
}

function main(
  ctx: Context
): void {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {

    listContent.push(item)

    if (!Item.equal(item, 'edge', 'parameter-start')) return

    const iStart = findFunctionStart(ctx, i)

    cacheParameter.clear()
    cacheContext.clear()
    pickParameter(ctx, i, item)
    pickContext(ctx, iStart, item)

    cacheContext.forEach((isDefined, name) => {

      if (isDefined) return
      if (cacheParameter.has(name)) return
      if (name.startsWith('__') && name.endsWith('__')) return // like `__xxx__`
      if (name[0].toLowerCase() !== name[0]) return // like `Xxx`

      listContent.push(
        ...[
          ['identifier', name],
          ['sign', '='],
          ['identifier', name],
          ['sign', ','],
        ].map(args => Item.new(
          args[0] as Item['type'],
          args[1],
          item.scope,
        ))
      )
    })
  })

  content.load(listContent)

  // (a,)
  removeTrailingComma(ctx)
}

function pickContext(
  ctx: Context,
  i: number,
  item: Item,
) {

  const { content } = ctx
  // if (i >= content.list.length) return
  const it = content.eq(i)

  if (
    Item.equal(it, 'edge', 'block-end')
    && it.scope.join('|') === [
      ...item.scope.slice(0, item.scope.length - 1),
      'function',
    ].join('|')
  ) return

  if (
    it.type === 'identifier'
    && !cacheContext.get(it.value)
  ) {
    const prev = content.eq(i - 1)
    const next = content.eq(i + 1)
    cacheContext.set(it.value, (
      Item.equal(prev, 'for', 'for')
      || Item.equal(next, 'sign', '=')
      || Item.equal(next, 'for-in')
    ))
  }

  pickContext(ctx, i + 1, item)
}

function pickParameter(
  ctx: Context,
  i: number,
  item: Item,
) {

  const { content } = ctx
  // if (i >= content.list.length) return
  const it = content.eq(i)

  if (
    Item.equal(it, 'edge', 'parameter-end')
    && it.scope.join('|') === item.scope.join('|')
  ) return

  if (it.type === 'identifier') {
    const next = content.eq(i + 1)
    if (
      Item.equal(next, 'sign', '=')
      || Item.equal(next, 'sign', ',')
      || Item.equal(next, 'sign', '...')
      || Item.equal(next, 'edge', 'parameter-end')
    ) cacheParameter.add(it.value)
  }

  pickParameter(ctx, i + 1, item)
}

function removeTrailingComma(
  ctx: Context
): void {

  const { content } = ctx

  const listContent: Item[] = []
  content.list.forEach((item, i) => {

    if (
      Item.equal(item, 'sign', ',')
      && Item.equal(content.eq(i + 1), 'edge', 'parameter-end')
    ) return

    listContent.push(item)
  })

  content.load(listContent)
}

// export
export default main