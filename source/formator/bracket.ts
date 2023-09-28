import { Context } from '../types'

// function

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === '(' || type === ')') {
    content.push('bracket', value)
    return true
  }

  return false
}

// export
export default main
