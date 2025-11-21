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
    if (value === '||=' || value === '?=' || value === '&&=') {
      const line = ctx.token[2].first_line + 1
      throw new Error(
        `ahk/forbidden (line ${line}): compound assignment '${value}' is not supported. Only standard assignments are allowed.`,
      )
    }
    if (value === '//=') {
      const line = ctx.token[2].first_line + 1
      throw new Error(
        `ahk/forbidden (line ${line}): floor division assignment '//=' is not supported (conflicts with AHK comments).`,
      )
    }
    if (value === '%%=') {
      const line = ctx.token[2].first_line + 1
      throw new Error(
        `ahk/forbidden (line ${line}): modulo assignment '%%=' is not supported. Use 'x := Mod(x, b)' instead.`,
      )
    }
    content.push('math', value)
    return true
  }
  if (type === 'math') {
    // // is floor division in CoffeeScript but comment in AHK
    if (value === '//') {
      const line = ctx.token[2].first_line + 1
      throw new Error(
        `ahk/forbidden (line ${line}): floor division '//' is not supported (conflicts with AHK comments). Use 'Math.floor(a / b)' instead.`,
      )
    }
    // %% is modulo in CoffeeScript but not supported in AHK
    if (value === '%%') {
      const line = ctx.token[2].first_line + 1
      throw new Error(
        `ahk/forbidden (line ${line}): modulo '%%' is not supported. Use 'Mod(a, b)' instead.`,
      )
    }
    content.push('math', value)
    return true
  }

  return false
}

export default main
