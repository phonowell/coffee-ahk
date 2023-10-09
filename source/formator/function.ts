import { Context } from '../types'
import Item from '../module/Item'

// functions

const arrow = (ctx: Context, type: string) => {
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
    const scp2: Item['scope'] = [...scope.clone(), 'parameter']
    content.list.splice(
      findEdge(ctx) + 1,
      0,
      Item.new('this', 'this', scp2),
      Item.new('sign', '=', scp2),
      Item.new('this', 'this', scp2),
      Item.new('sign', ',', scp2),
    )
  }

  scope.push('function')
  return true
}

const start = (ctx: Context) => {
  const { content, scope } = ctx

  if (!content.at(-2)?.is('property', 'constructor'))
    content.push('identifier', 'anonymous')

  scope.push('parameter')
  content.push('edge', 'parameter-start')
  return true
}

const findEdge = (
  ctx: Context,
  i: number = ctx.content.list.length - 1,
): number => {
  const { content } = ctx

  const it = content.at(i)
  if (!it) return 0

  if (it.is('edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

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
    const listItem = [content.at(-3), content.at(-2), content.at(-1)]
    if (
      listItem[0]?.is('identifier', 'Native') &&
      listItem[1]?.is('edge', 'call-start') &&
      listItem[2]?.is('string')
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
