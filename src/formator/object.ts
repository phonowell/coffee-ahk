import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, scope, token, type } = ctx

  if (type === '{') {
    if (scope.last === 'class' && !content.last.is('sign', '=')) return true

    if (content.last.is('new-line') && token.generated) content.pop()

    scope.push('object')
    content.push('bracket', '{')
    return true
  }

  if (type === '}') {
    if (scope.last === 'class') return true

    if (token.generated && typeof token.origin?.indentSize === 'number')
      content.push('bracket', '}-')
    else content.push('bracket', '}')
    scope.pop()
    return true
  }

  return false
}

// export
export default main
