import { Context } from '../entry/type'
import Item from '../module/Item'
import scope from '../module/Scope'

// function

const $arrow = (
  ctx: Context,
  type: string,
): boolean => {

  const { content, scope: _scope } = ctx

  // fn = -> xxx
  if (!Item.equal(content.last, 'edge', 'parameter-end')) {

    if (!Item.equal(
      content.list[content.list.length - 2],
      'property', 'constructor'
    )) content.push('identifier', 'anonymous')

    _scope.push('parameter')
    content.push('edge', 'parameter-start')

    if (type === '=>')
      content
        .push('this')
        .push('sign', '=')
        .push('this')

    content.push('edge', 'parameter-end')
    _scope.pop()
  } else if (type === '=>') {
    const _scope2: Item['scope'] = [..._scope.clone(), 'parameter']
    content.list.splice(
      findEdge(ctx) + 1,
      0,
      Item.new('this', 'this', _scope2),
      Item.new('sign', '=', _scope2),
      Item.new('this', 'this', _scope2),
      Item.new('sign', ',', _scope2)
    )
  }

  _scope.push('function')
  return true
}

const $start = (
  ctx: Context,
): boolean => {

  const { scope: cache, content } = ctx

  if (!Item.equal(
    content.list[content.list.length - 2],
    'property', 'constructor'
  )) content.push('identifier', 'anonymous')

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

  if (Item.equal(it, 'edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

const main = (
  ctx: Context,
): boolean => {

  const { content, type } = ctx

  if (['->', '=>'].includes(type)) return $arrow(ctx, type)

  if (type === 'call_start') {
    const _next = scope.next
    scope.next = ''
    scope.push('call')
    scope.next = _next
    content.push('edge', 'call-start')
    return true
  }

  if (type === 'call_end') {
    content.push('edge', 'call-end')
    scope.pop()
    return true
  }

  if (type === 'param_start') return $start(ctx)

  if (type === 'param_end') {
    content.push('edge', 'parameter-end')
    scope.pop()
    return true
  }

  return false
}

// export
export default main