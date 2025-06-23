import type { Context } from '../types'

const handlePlusOperator = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (!token.spaced) {
    const { last } = content

    if (last.type === 'math' || last.type === 'negative') {
      if (last.type === 'negative') last.type = 'math'
      content.push('negative', '+')
      return true
    }
  }

  content.push('math', '+')
  return true
}

const handleMinusOperator = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (!token.spaced) {
    const { last } = content

    if (!['identifier', 'math'].includes(last.type)) {
      if (last.type === 'negative') last.type = 'math'
      content.push('negative', '-')
      return true
    }
  }

  content.push('math', '-')
  return true
}

const handleUnaryOperator = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if ((type === 'unary' && value === '!') || type === 'unary_math') {
    content.push('logical-operator', '!')
    return true
  }

  return false
}

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === '+') return handlePlusOperator(ctx)
  if (type === '-') return handleMinusOperator(ctx)
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
  if (type === '&&' || type === '||') {
    content.push('logical-operator', value)
    return true
  }
  if (type === 'unary' || type === 'unary_math') return handleUnaryOperator(ctx)
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

  return false
}

export default main
