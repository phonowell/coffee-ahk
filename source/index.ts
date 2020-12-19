import $ from 'fire-keeper'
import format from './formator'
import log from './logger'
import { read_, write_ } from './file'

// interface

export type Option = Partial<typeof optionDefault>

// variable

const optionDefault = {
  asText: false,
  ast: false,
  autoGlobal: true,
  checkType: true,
  displayCoffeescriptAst: false,
  ignoreComment: true,
  insertTranslatorInformation: true,
  pickAnonymous: true,
  salt: '',
  save: true,
  verbose: false
}

// function

async function compile_(
  source: string,
  option: Option
): Promise<string> {

  const content = option.asText
    ? source
    : await read_(source)

  const result = format(content, option)
  if (option.verbose) {
    if (option.displayCoffeescriptAst)
      $.i(result.raw)
    log(result.ast)
  }
  if (option.save && !option.asText) await write_(source, result, option)
  return result.content
}

async function main_(
  source: string,
  option: Option = {}
): Promise<string> {

  option = Object.assign({}, optionDefault, option)

  // salt
  if (!option.salt)
    option.salt = Math.random()
      .toString(32)
      .split('.')[1]
      .padStart(11, '0')

  if (option.asText) return await compile_(source, option)

  const listSource = await $.source_(source)
  if (!listSource.length)
    throw new Error(`invalid source '${source}'`)

  return await compile_(listSource[0], option)
}

// export
export default main_