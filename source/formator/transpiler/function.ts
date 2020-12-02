// interface

import cache from '../module/cache'
import { Context } from '../type'

type Item = Context['content']['list'][number]

// function

function $arrow(
  ctx: Context,
  type: string
): boolean {

  const { cache, content } = ctx

  // fn = -> xxx
  if (!content.equal(content.last, 'edge', 'parameter-end')) {

    if (!content.equal(
      content.list[content.list.length - 2],
      'property', 'constructor'
    )) content.push('identifier', 'anonymous')

    cache.push('parameter')
    content.push('edge', 'parameter-start')

    if (type === '=>')
      content
        .push('this')
        .push('sign', '=')
        .push('this')

    content.push('edge', 'parameter-end')
    cache.pop()
  } else {
    if (type === '=>') {
      const scope: Item['scope'] = [...cache.clone(), 'parameter']
      content.list.splice(
        findEdge(ctx) + 1,
        0,
        content.new('this', 'this', scope),
        content.new('sign', '=', scope),
        content.new('this', 'this', scope),
        content.new('sign', ',', scope)
      )
    }
  }

  cache.push('function')
  return true
}

function $start(
  ctx: Context
): boolean {

  const { cache, content } = ctx

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
    const _next = cache.next
    cache.next = ''
    cache.push('call')
    cache.next = _next
    content.push('edge', 'call-start')
    return true
  }

  if (type === 'call_end') {
    content.push('edge', 'call-end')
    cache.pop()
    return true
  }

  if (type === 'param_start') return $start(ctx)

  if (type === 'param_end') {
    content.push('edge', 'parameter-end')
    cache.pop()
    return true
  }

  return false
}

// export
export default main