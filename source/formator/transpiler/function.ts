// interface

import scope from '../module/scope'
import { Context } from '../type'

type Item = Context['content']['list'][number]

// function

function $arrow(
  ctx: Context,
  type: string
): boolean {

  const { content, scope } = ctx

  // fn = -> xxx
  if (!content.equal(content.last, 'edge', 'parameter-end')) {

    if (!content.equal(
      content.list[content.list.length - 2],
      'property', 'constructor'
    )) content.push('identifier', 'anonymous')

    scope.push('parameter')
    content.push('edge', 'parameter-start')

    if (type === '=>')
      content
        .push('this')
        .push('sign', '=')
        .push('this')

    content.push('edge', 'parameter-end')
    scope.pop()
  } else {
    if (type === '=>') {
      const _scope: Item['scope'] = [...scope.clone(), 'parameter']
      content.list.splice(
        findEdge(ctx) + 1,
        0,
        content.new('this', 'this', _scope),
        content.new('sign', '=', _scope),
        content.new('this', 'this', _scope),
        content.new('sign', ',', _scope)
      )
    }
  }

  scope.push('function')
  return true
}

function $start(
  ctx: Context
): boolean {

  const { scope: cache, content } = ctx

  if (!content.equal(
    content.list[content.list.length - 2],
    'property', 'constructor'
  )) content.push('identifier', 'anonymous')

  cache.push('parameter')
  content.push('edge', 'parameter-start')
  return true
}

function findEdge(
  ctx: Context,
  i: number = ctx.content.list.length - 1
): number {

  const { content } = ctx

  const it = content.eq(i)
  if (!it) return 0

  if (content.equal(it, 'edge', 'parameter-start')) return i
  return findEdge(ctx, i - 1)
}

function main(
  ctx: Context
): boolean {

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