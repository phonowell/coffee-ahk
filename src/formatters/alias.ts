import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === '@') {
    content.push({ type: 'this', value: 'this' })
    return true
  }

  if (type === '::') {
    if (content.at(-1)?.is('.')) content.pop()
    content.push({ type: '.', value: '.' }, { type: 'prototype', value: '::' })
    return true
  }

  return false
}

export default main
