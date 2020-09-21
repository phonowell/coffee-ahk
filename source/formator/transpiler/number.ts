import _ from 'lodash'

// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'number') {

    let _value = value

    if (value.includes('n'))
      throw new Error("ahk/forbidden: 'BigInt' is not allowed")

    if (value.includes('_'))
      _value = _value.replace(/\_/g, '')

    if (value.includes('e')) {
      const [pre, sub] = _value.split('e')
      _value = `${pre}${_.repeat('0', parseInt(sub))}`
    }

    content.push(ctx, 'number', _value)
    return true
  }

  return false
}

// export
export default main