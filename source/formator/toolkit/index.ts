import _ from 'lodash'

// interface

import { Context } from '../type'

// function

function insertIndent(
  ctx: Context,
  fix = 0
): string {
  return _.repeat(' ', (ctx.indent + fix) * 2)
}

function isBreak(
  input: string | number | undefined
): boolean {

  if (typeof input !== 'string') return false
  if (!input.includes('\n')) return false
  if (input.trim()) return false
  return true
}

// export
export {
  insertIndent,
  isBreak
}