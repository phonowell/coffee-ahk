import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'number') {
    let value2 = value

    if (value.includes('n')) {
      throw new Error(
        `ahk/forbidden: 'BigInt' literal is not supported in AHK v1. Offending value: '${value}'`,
      )
    }

    if (value.includes('_')) value2 = value2.replace(/_/g, '')

    if (value.includes('e')) {
      const [pre, sub] = value2.split('e')
      value2 = `${pre}${'0'.repeat(parseInt(sub, 10))}`
    }

    content.push('number', value2)
    return true
  }

  return false
}

export default main
