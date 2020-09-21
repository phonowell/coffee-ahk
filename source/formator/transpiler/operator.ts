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
        content.push(ctx, 'negative', '+')
        return true
      }
    }

    content.push(ctx, 'math', '+')
    return true
  }

  if (type === '-') {

    if (!raw.spaced) {

      const { last } = content

      if (last.type === 'math' || last.type === 'negative') {
        if (last.type === 'negative')
          last.type = 'math'
        content.push(ctx, 'negative', '-')
        return true
      }
    }

    content.push(ctx, 'math', '-')
    return true
  }

  if (type === '++') {
    content.push(ctx, '++')
    return true
  }

  if (type === '--') {
    content.push(ctx, '--')
    return true
  }

  if (type === '**') {
    content.push(ctx, 'math', '**')
    return true
  }

  if (type === '&&') {
    content.push(ctx, 'logical-operator', value)
    return true
  }

  if (type === '||') {
    content.push(ctx, 'logical-operator', value)
    return true
  }

  if ((type === 'unary' && value === '!') || type === 'unary_math') {
    content.push(ctx, 'logical-operator', '!')
    return true
  }

  if (type === 'compare') {
    content.push(ctx, 'compare', value)
    return true
  }

  if (type === 'compound_assign') {
    content.push(ctx, 'math', value)
    return true
  }

  if (type === 'math') {
    content.push(ctx, 'math', value)
    return true
  }

  return false
}

// export
export default main