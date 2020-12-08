// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, raw, scope, type } = ctx

  if (type === '{') {

    if (
      scope.last === 'class'
      && !content.equal(content.last, 'sign', '=')
    ) return true

    if (content.last.type === 'new-line' && raw.generated)
      content.pop()

    scope.push('object')
    content.push('bracket', '{')
    return true
  }

  if (type === '}') {

    if (scope.last === 'class') return true

    if (raw.generated && typeof raw.origin?.indentSize === 'number')
      content.push('bracket', '}-')
    else content.push('bracket', '}')
    scope.pop()
    return true
  }

  return false
}

// export
export default main