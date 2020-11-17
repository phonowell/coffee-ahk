import $ from 'fire-keeper'
import format from './formator'
import log from './logger'
import { read_, write_ } from './file'

// interface

export type Option = {
  salt?: string,
  save?: boolean
  verbose?: boolean
}

// function

async function compile_(
  source: string,
  option: Option
): Promise<string> {

  const content = await read_(source)
  const result = format(content, option)
  if (option.verbose) {
    // $.i(result.raw)
    log(result.ast)
  }
  if (option.save) await write_(source, result)
  return result.content
}

async function main_(
  source: string,
  option: Option = {}
): Promise<string> {

  const listSource = await $.source_(source)
  if (!listSource.length)
    throw new Error(`invalid source '${source}'`)

  // salt
  if (!option.salt)
    option.salt = Math.random()
      .toString(32)
      .split('.')[1]
      .padStart(11, '0')

  // save
  if (typeof option.save === 'undefined')
    option.save = true

  return await compile_(listSource[0], option)
}

// export
export default main_