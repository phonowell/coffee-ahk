import { Context } from '../entry/type'

// function

const main = (ctx: Context): boolean => {
  const { content, type } = ctx

  if (type === 'await') {
    content.push('await')
    return true
  }

  return false
}

// export
export default main
