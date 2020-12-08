// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, scope, type } = ctx

  if (type === 'indent') {

    // indent after '='
    if (content.equal(content.last, 'sign', '=')) return true

    if ([
      'array', 'call', 'object', 'parameter'
    ].includes(scope.last)) return true
    ctx.indent++

    const last = scope.last
    if (['case', 'for', 'function', 'switch'].includes(last)) {
      if (!['catch', 'else', 'if', 'while'].includes(scope.next)) {
        if (last === 'case')
          content.push('sign', ':')
        content.push('edge', 'block-start')
      }
    }

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

    content.push('new-line', ctx.indent.toString())
    return true
  }

  if (type === 'outdent') {

    if (content.equal(content.last, 'bracket', '}-')) {
      content.last.value = '}'
      return true
    }

    if ([
      'array', 'call', 'object', 'parameter'
    ].includes(scope.last)) return true
    ctx.indent--

    if (!scope.length) return true

    content
      .push('new-line', ctx.indent.toString())
      .push('edge', 'block-end')

    scope.pop()
    return true
  }

  return false
}

// export
export default main