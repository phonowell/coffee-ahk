import repeat from 'lodash/repeat'

import { Context } from '../types'

// function

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'number') {
    let value2 = value

    if (value.includes('n'))
      throw new Error("ahk/forbidden: 'BigInt' is not allowed")

    if (value.includes('_')) value2 = value2.replace(/_/g, '')

    if (value.includes('e')) {
      const [pre, sub] = value2.split('e')
      value2 = `${pre}${repeat('0', parseInt(sub, 10))}`
    }

    content.push('number', value2)
    return true
  }

  return false
}

// export
export default main
