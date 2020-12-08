import $ from 'fire-keeper'
import format from './formator'
import log from './logger'
import { read_, write_ } from './file'

// interface

export type Option = Partial<typeof optionDefault>

// variable

const optionDefault = {
  ast: false,
  displayCoffeescriptAst: false,
  ignoreComment: true,
  insertCompilerInformation: true,
  salt: '',
  save: true,
  verbose: false
}

// function

async function compile_(
  source: string,
  option: Option
): Promise<string> {

  const content = await read_(source)
  const result = format(content, option)
  if (option.verbose) {
    if (option.displayCoffeescriptAst)
      $.i(result.raw)
    log(result.ast)
  }
  if (option.save) await write_(source, result, option)
  return result.content
}

async function main_(
  source: string,
  option: Option = {}
): Promise<string> {

  const listSource = await $.source_(source)
  if (!listSource.length)
    throw new Error(`invalid source '${source}'`)

  option = Object.assign({}, optionDefault, option)

  // salt
  if (!option.salt)
    option.salt = Math.random()
      .toString(32)
      .split('.')[1]
      .padStart(11, '0')

  return await compile_(listSource[0], option)
}

// export
export default main_