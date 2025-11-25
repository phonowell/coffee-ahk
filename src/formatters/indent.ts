import type { Context } from '../types'

const handleIndentEarlyReturns = (ctx: Context): boolean => {
  const { content, scope } = ctx

  if (content.at(-1)?.is('sign', '=')) return true

  if (['array', 'call', 'object', 'parameter'].includes(scope.last)) return true

  return false
}

const handleBlockStartScopes = (ctx: Context): void => {
  const { content, scope } = ctx
  const { last } = scope

  if (['case', 'for', 'function', 'switch'].includes(last)) {
    if (!['catch', 'class', 'else', 'if', 'while'].includes(scope.next)) {
      if (last === 'case') content.push('sign', ':')
      content.push('edge', 'block-start')
    }
  }
}

const handleNextScopes = (ctx: Context): void => {
  const { content, scope } = ctx

  if (['catch', 'class', 'else'].includes(scope.next)) {
    const _next = scope.next
    scope.next = ''
    scope.push(_next)
    content.push('edge', 'block-start')
  }

  if (['if', 'while'].includes(scope.next)) {
    content.push('edge', 'expression-end')
    const _next = scope.next
    scope.next = ''
    scope.push(_next)
    content.push('edge', 'block-start')
  }
}

const handleIndent = (ctx: Context): void => {
  if (handleIndentEarlyReturns(ctx)) return

  ctx.indent++
  handleBlockStartScopes(ctx)
  handleNextScopes(ctx)
  ctx.content.push('new-line', ctx.indent.toString())
}

const handleOutdent = (ctx: Context): void => {
  const { content, scope } = ctx

  const last = content.at(-1)
  if (last?.is('bracket', '}-')) {
    last.value = '}'
    return
  }

  if (['array', 'call', 'object', 'parameter'].includes(scope.last)) return

  ctx.indent--

  if (!scope.length) return

  content.push('new-line', ctx.indent.toString()).push('edge', 'block-end')
  scope.pop()
}

const main = (ctx: Context) => {
  const { type } = ctx

  if (type === 'indent') {
    handleIndent(ctx)
    return true
  }

  if (type === 'outdent') {
    handleOutdent(ctx)
    return true
  }

  return false
}

export default main
