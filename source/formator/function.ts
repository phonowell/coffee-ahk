import { Context } from '../types'
import Item from '../module/Item'
import scope from '../module/Scope'

// functions

const arrow = (ctx: Context, type: string) => {
  const { content, scope: scp } = ctx

  // fn = -> xxx
  if (!Item.is(content.last, 'edge', 'parameter-end')) {
    if (
      !Item.is(content.list[content.list.length - 2], 'property', 'constructor')
    )
      content.push('identifier', 'anonymous')

    scp.push('parameter')
    content.push('edge', 'parameter-start')

    if (type === '=>') content.push('this').push('sign', '=').push('this')

    content.push('edge', 'parameter-end')
    scp.pop()
  } else if (type === '=>') {
    const scp2: Item['scope'] = [...scp.clone(), 'parameter']
    content.list.splice(
      findEdge(ctx) + 1,
      0,
      Item.new('this', 'this', scp2),
      Item.new('sign', '=', scp2),
      Item.new('this', 'this', scp2),
      Item.new('sign', ',', scp2),
    )
  }

  scp.push('function')
  return true
}

const start = (ctx: Context) => {
  const { scope: cache, content } = ctx

  if (
    !Item.is(content.list[content.list.length - 2], 'property', 'constructor')
  )
    content.push('identifier', 'anonymous')

  cache.push('parameter')
  content.push('edge', 'parameter-start')
  return true
}

const findEdge = (
  ctx: Context,
  i: number = ctx.content.list.length - 1,
): number => {
  const { content } = ctx

  const it = content.eq(i)
  if (!it) return 0

  if (Item.is(it, 'edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (['->', '=>'].includes(type)) return arrow(ctx, type)

  if (type === 'call_start') {
    ctx.flag.isFunctionIncluded = true
    const { next } = scope
    scope.next = ''
    scope.push('call')
    scope.next = next
    content.push('edge', 'call-start')
    return true
  }

  if (type === 'call_end') {
    // Native(string)
    const listItem = [content.eq(-3), content.eq(-2), content.eq(-1)]
    if (
      Item.is(listItem[0], 'identifier', 'Native') &&
      Item.is(listItem[1], 'edge', 'call-start') &&
      Item.is(listItem[2], 'string')
    ) {
      listItem[0].type = 'void'
      listItem[1].type = 'void'
      listItem[2].scope.pop()
      listItem[2].type = 'native'
      const { value } = listItem[2]
      listItem[2].value = value
        .substring(1, value.length - 1)
        .replace(/`%/g, '%')
        .replace(/"{2,}/g, '"')
      content.push('void', 'call-end')
      scope.pop()
      return true
    }

    content.push('edge', 'call-end')
    scope.pop()
    return true
  }

  if (type === 'param_start') return start(ctx)

  if (type === 'param_end') {
    content.push('edge', 'parameter-end')
    scope.pop()
    return true
  }

  return false
}

// export
export default main
