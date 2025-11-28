import { TYPEOF } from '../constants.js'

import type { ItemTypeMap } from '../models/ItemType'
import type { Context } from '../types'

const handlePlusOperator = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (!token.spaced) {
    const last = content.at(-1)

    if (last?.type === 'math' || last?.type === 'negative') {
      if (last.type === 'negative') last.type = 'math'
      content.push({ type: 'negative', value: '+' })
      return true
    }
  }

  content.push({ type: 'math', value: '+' })
  return true
}

const handleMinusOperator = (ctx: Context): boolean => {
  const { content, token } = ctx

  if (!token.spaced) {
    const last = content.at(-1)

    if (last && !['identifier', 'math'].includes(last.type)) {
      if (last.type === 'negative') last.type = 'math'
      content.push({ type: 'negative', value: '-' })
      return true
    }
  }

  content.push({ type: 'math', value: '-' })
  return true
}

const getLine = (ctx: Context): number => ctx.token[2].first_line + 1

const handleUnaryOperator = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'unary' && value === 'typeof') {
    ctx.flag.isTypeofUsed = true
    content.push(
      { type: 'identifier', value: `${TYPEOF}_${ctx.options.salt}` },
      { type: 'edge', value: 'typeof-start' },
    )
    return true
  }

  if (type === 'unary' && value === 'delete') {
    throw new Error(
      `Coffee-AHK/forbidden (line ${getLine(ctx)}): 'delete' is not supported in AHK.`,
    )
  }

  if (type === 'unary' && value === '!') {
    content.push({ type: 'logical-operator', value: '!' })
    return true
  }

  // Bitwise NOT (~) or Logical NOT (!)
  if (type === 'unary_math') {
    if (value === '~') content.push({ type: 'math', value: '~' })
    else if (value === '!')
      content.push({ type: 'logical-operator', value: '!' })

    return true
  }

  return false
}

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === '+') return handlePlusOperator(ctx)
  if (type === '-') return handleMinusOperator(ctx)
  if (type === '++') {
    content.push({ type: '++', value: '++' })
    return true
  }
  if (type === '--') {
    content.push({ type: '--', value: '--' })
    return true
  }
  if (type === '**') {
    content.push({ type: 'math', value: '**' })
    return true
  }
  if (type === '&&' || type === '||') {
    content.push({
      type: 'logical-operator',
      value: value as ItemTypeMap['logical-operator'],
    })
    return true
  }
  if (type === 'unary' || type === 'unary_math') return handleUnaryOperator(ctx)
  if (type === 'compare') {
    content.push({ type: 'compare', value: value as ItemTypeMap['compare'] })
    return true
  }
  if (type === 'compound_assign') {
    if (value === '||=' || value === '?=' || value === '&&=') {
      throw new Error(
        `Coffee-AHK/forbidden (line ${getLine(ctx)}): compound assignment '${value}' is not supported. Only standard assignments are allowed.`,
      )
    }
    if (value === '//=') {
      throw new Error(
        `Coffee-AHK/forbidden (line ${getLine(ctx)}): floor division assignment '//=' is not supported (conflicts with AHK comments).`,
      )
    }
    if (value === '%%=') {
      throw new Error(
        `Coffee-AHK/forbidden (line ${getLine(ctx)}): modulo assignment '%%=' is not supported. Use 'x := Mod(x, b)' instead.`,
      )
    }
    content.push({ type: 'math', value: value as ItemTypeMap['math'] })
    return true
  }
  if (type === 'math') {
    // // is floor division in CoffeeScript but comment in AHK
    if (value === '//') {
      throw new Error(
        `Coffee-AHK/forbidden (line ${getLine(ctx)}): floor division '//' is not supported (conflicts with AHK comments). Use 'Math.floor(a / b)' instead.`,
      )
    }
    // %% is modulo in CoffeeScript but not supported in AHK
    if (value === '%%') {
      throw new Error(
        `Coffee-AHK/forbidden (line ${getLine(ctx)}): modulo '%%' is not supported. Use 'Mod(a, b)' instead.`,
      )
    }
    content.push({ type: 'math', value: value as ItemTypeMap['math'] })
    return true
  }

  // Bitwise operators: &, |, ^, <<, >>
  if (type === '&' || type === '|' || type === '^' || type === 'shift') {
    // Unsigned right shift is not supported in AHK
    if (value === '>>>' || value === '>>>=') {
      throw new Error(
        `Coffee-AHK/unsupported (line ${getLine(ctx)}): unsigned right shift '${value}' is not supported in AHK. Use '>>' instead.`,
      )
    }
    content.push({ type: 'math', value: value as ItemTypeMap['math'] })
    return true
  }

  // instanceof: obj instanceof Class → obj.__Class == "Class"
  if (type === 'relation' && value === 'instanceof') {
    content.push(
      { type: '.', value: '.' },
      { type: 'property', value: '__Class' },
      { type: 'compare', value: '==' },
      { type: 'edge', value: 'instanceof-class' }, // marker for processor to convert next identifier to string
    )
    return true
  }

  return false
}

export default main
