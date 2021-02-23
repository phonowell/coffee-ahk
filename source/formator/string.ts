import { Context } from '../entry/type'
import _ from 'lodash'

// function

function main(
  ctx: Context
): boolean {

  const { content, raw, type, value } = ctx

  if (type === 'string') {
    content.push('string', transAlias(value, raw[1].quote))
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
  input: string,
  wrapper: string,
): string {

  let result = input
    .replace(/%/gu, '`%')
    .replace(/\\b/gu, '`b')
    .replace(/\\n/gu, '`n')
    .replace(/\\r/gu, '`r')
    .replace(/\\t/gu, '`t')

  if (wrapper.length === 3)
    result = result
      .replace(/\s*\n\s*/gu, '')
  else
    result = result
      .replace(/\s*\n\s*/gu, ' ')

  return result
}

// export
export default main