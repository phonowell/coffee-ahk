import type { Context } from '../types'

const handlePlusOperator = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (!token.spaced) {
    const last = content.at(-1)

    if (last?.type === 'math' || last?.type === 'negative') {
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
    const last = content.at(-1)

    if (last && !['identifier', 'math'].includes(last.type)) {
      if (last.type === 'negative') last.type = 'math'
      content.push('negative', '-')
      return true
    }
  }

  content.push('math', '-')
  return true
}

const getLine = (ctx: Context): number => ctx.token[2].first_line + 1

const handleUnaryOperator = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'unary' && value === 'typeof') {
    ctx.flag.isTypeofUsed = true
    content.push('identifier', `__typeof_${ctx.options.salt}__`)
    content.push('edge', 'typeof-start')
    return true
  }

  if (type === 'unary' && value === 'delete') {
    throw new Error(
      `ahk/forbidden (line ${getLine(ctx)}): 'delete' is not supported in AHK.`,
    )
  }

  if (type === 'unary' && value === '!') {
    content.push('logical-operator', '!')
    return true
  }

  // Bitwise NOT (~)
  if (type === 'unary_math') {
    content.push('math', '~')
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
      throw new Error(
        `ahk/forbidden (line ${getLine(ctx)}): compound assignment '${value}' is not supported. Only standard assignments are allowed.`,
      )
    }
    if (value === '//=') {
      throw new Error(
        `ahk/forbidden (line ${getLine(ctx)}): floor division assignment '//=' is not supported (conflicts with AHK comments).`,
      )
    }
    if (value === '%%=') {
      throw new Error(
        `ahk/forbidden (line ${getLine(ctx)}): modulo assignment '%%=' is not supported. Use 'x := Mod(x, b)' instead.`,
      )
    }
    content.push('math', value)
    return true
  }
  if (type === 'math') {
    // // is floor division in CoffeeScript but comment in AHK
    if (value === '//') {
      throw new Error(
        `ahk/forbidden (line ${getLine(ctx)}): floor division '//' is not supported (conflicts with AHK comments). Use 'Math.floor(a / b)' instead.`,
      )
    }
    // %% is modulo in CoffeeScript but not supported in AHK
    if (value === '%%') {
      throw new Error(
        `ahk/forbidden (line ${getLine(ctx)}): modulo '%%' is not supported. Use 'Mod(a, b)' instead.`,
      )
    }
    content.push('math', value)
    return true
  }

  // Bitwise operators: &, |, ^, <<, >>
  if (type === '&' || type === '|' || type === '^' || type === 'shift') {
    content.push('math', value)
    return true
  }

  // instanceof: obj instanceof Class → obj.__Class == "Class"
  if (type === 'relation' && value === 'instanceof') {
    content.push('.', '.')
    content.push('property', '__Class')
    content.push('compare', '==')
    content.push('edge', 'instanceof-class') // marker for processor to convert next identifier to string
    return true
  }

  return false
}

export default main
