// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, raw, type, value } = ctx

  if (type === '+') {

    if (!raw.spaced) {

      const { last } = content

      if (last.type === 'math' || last.type === 'negative') {
        if (last.type === 'negative')
          last.type = 'math'
        content.push('negative', '+')
        return true
      }
    }

    content.push('math', '+')
    return true
  }

  if (type === '-') {

    if (!raw.spaced) {

      const { last } = content

      if (last.type === 'math' || last.type === 'negative') {
        if (last.type === 'negative')
          last.type = 'math'
        content.push('negative', '-')
        return true
      }
    }

    content.push('math', '-')
    return true
  }

  if (type === '++') {
    content.push('++')
    return true
  }

  if (type === '--') {
    content.push('--')
    return true
  }

  if (type === '**') {
    content.push('math', '**')
    return true
  }

  if (type === '&&') {
    content.push('and', value)
    return true
  }

  if (type === 'compare') {
    content.push('compare', value)
    return true
  }

  if (type === 'compound_assign') {
    content.push('math', value)
    return true
  }

  if (type === 'math') {
    content.push('math', value)
    return true
  }

  if (type === '||') {
    content.push('or', value)
    return true
  }

  return false
}

// export
export default main