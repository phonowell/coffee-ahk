import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, scope, token, type } = ctx

  if (type === '{') {
    if (scope.last === 'class' && !content.at(-1)?.is('sign', '=')) return true

    if (content.at(-1)?.is('new-line') && token.generated) content.pop()

    scope.push('object')
    content.push({ type: 'bracket', value: '{' })
    return true
  }

  if (type === '}') {
    if (scope.last === 'class') return true

    if (token.generated && typeof token.origin?.indentSize === 'number')
      content.push({ type: 'bracket', value: '}-' })
    else content.push({ type: 'bracket', value: '}' })
    scope.pop()
    return true
  }

  return false
}

export default main
