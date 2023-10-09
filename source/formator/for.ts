import { Context } from '../types'
import Item from '../module/Item'

// function

const main = (ctx: Context) => {
  const { content, scope, type, value } = ctx

  if (type === 'for') {
    scope.push('for')
    content.push('for')
    return true
  }

  if (['forin', 'forof'].includes(type)) {
    const list: string[] = []

    const last = content.pop() ?? new Item()
    list.push(last.value)

    const last2 = content.last
    if (last2.is('sign', ',')) {
      content.pop()

      const last3 = content.pop()
      if (!last3) throw new Error('Unexpected error: formator/for/1')
      list.unshift(last3.value)
    }

    if (type === 'forin') list.reverse()

    if (list.length === 1)
      list.unshift(type === 'forin' ? '__index_for__' : '__key_for__')

    content
      .push('identifier', list[0])
      .push('sign', ',')
      .push('identifier', list[1])
      .push('for-in', value)
    return true
  }

  return false
}

// export
export default main
