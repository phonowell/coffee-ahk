import { read_, write_ } from './file'
import $ from 'fire-keeper'
import format from './formator'
import log from './logger'

// interface

export type Option = Partial<typeof optionDefault>

// variable

const optionDefault = {
  asText: false,
  ast: false,
  checkType: true,
  displayCoffeescriptAst: false,
  ignoreComment: true,
  insertTranslatorInformation: true,
  pickAnonymous: true,
  salt: '',
  save: true,
  verbose: false,
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
  if (option.save && !option.asText)
    await write_(source, result, option)
  return result.content
}

async function main_(
  source: string,
  option: Option = {}
): Promise<string> {

  const _option = {
    ...optionDefault,
    ...option,
  }

  // salt
  if (!_option.salt)
    _option.salt = Math.random()
      .toString(32)
      .split('.')[1]
      .padStart(11, '0')

  if (_option.asText) return compile_(source, _option)

  const listSource = await $.source_(source)
  if (!listSource.length)
    throw new Error(`invalid source '${source}'`)

  return compile_(listSource[0], _option)
}

// export
export default main_
