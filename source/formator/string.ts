import { Context } from '../entry/type'

// function

const main = (ctx: Context): boolean => {
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

const transAlias = (input: string, wrapper: string): string => {
  let result = input.substr(1, input.length - 2)

  result = result
    .replace(/%/g, '`%')
    .replace(/\\b/g, '`b')
    .replace(/\\n/g, '`n')
    .replace(/\\r/g, '`r')
    .replace(/\\t/g, '`t')

  result = `"${result.replace(/"/g, '""')}"`

  result =
    wrapper.length === 3
      ? result.replace(/\s*\n\s*/g, '')
      : result.replace(/\s*\n\s*/g, ' ')

  return result
}

// export
export default main
