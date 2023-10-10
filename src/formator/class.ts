import { Context } from '../types'

// function

const main = (ctx: Context) => {
  const { content, scope, type } = ctx

  if (type === 'class') {
    scope.next = 'class'
    content.push('class')
    return true
  }

  if (type === 'super') {
    content.push('super')
    return true
  }

  return false
}

// export
export default main
