// interface

import { Context } from '../type'

// function

function main(
  ctx: Context
): boolean {

  const { content, type, value } = ctx

  if (type === 'string') {
    content.push('string', transAlias(value))
    return true
  }

  // "xxx#{xxx}xxx"

  if (type === 'interpolation_start') {
    content.push('edge', 'interpolation-start')
    return true
  }

  if (type === 'interpolation_end') {
    content.push('edge', 'interpolation-end')
    return true
  }

  return false
}

function transAlias(
  input: string
): string {

  return input
    .replace(/%/gu, '`%')
    .replace(/\\b/gu, '`b')
    .replace(/\\n/gu, '`n')
    .replace(/\\r/gu, '`r')
    .replace(/\\t/gu, '`t')
    .replace(/\n/gu, ' ')
}

// export
export default main
