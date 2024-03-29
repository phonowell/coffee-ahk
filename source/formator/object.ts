import { Context } from '../types'
import Item from '../module/Item'

// function

const main = (ctx: Context): boolean => {
  const { content, raw, scope, type } = ctx

  if (type === '{') {
    if (scope.last === 'class' && !Item.is(content.last, 'sign', '='))
      return true

    if (Item.is(content.last, 'new-line') && raw.generated) content.pop()

    scope.push('object')
    content.push('bracket', '{')
    return true
  }

  if (type === '}') {
    if (scope.last === 'class') return true

    if (
      raw.generated &&
      raw.origin &&
      typeof raw.origin.indentSize === 'number'
    )
      content.push('bracket', '}-')
    else content.push('bracket', '}')
    scope.pop()
    return true
  }

  return false
}

// export
export default main
