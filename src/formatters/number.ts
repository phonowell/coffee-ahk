import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, token, type, value } = ctx
  const line = token[2].first_line + 1

  if (type === 'number') {
    let value2 = value

    if (value.includes('n')) {
      throw new Error(
        `Coffee-AHK/forbidden (line ${line}): 'BigInt' literal is not supported in AHK v1. Offending value: '${value}'`,
      )
    }

    if (value.includes('_')) value2 = value2.replace(/_/g, '')

    if (value.includes('e')) {
      const parts = value2.split('e')
      const pre = parts.at(0)
      const sub = parts.at(1)
      if (pre && sub) value2 = `${pre}${'0'.repeat(parseInt(sub, 10))}`
    }

    content.push({ type: 'number', value: value2 })
    return true
  }

  return false
}

export default main
