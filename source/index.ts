import log from './logger'
import start from './entry'

// interface

export type Option = Partial<typeof optionDefault>

// variable

const optionDefault = {
  asText: false,
  ast: false,
  checkType: true,
  displayCoffeescriptAst: false,
  ignoreComment: true,
  insertTranspilerInformation: true,
  pickAnonymous: true,
  salt: '',
  save: true,
  verbose: false,
}

// function

function generatedSalt(): string {

  return Math.random()
    .toString(32)
    .split('.')[1]
    .padStart(11, '0')
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
  if (!_option.salt) _option.salt = generatedSalt()

  if (_option.asText) return transpileAsText(source, _option)
  return transpileAsFile(source, _option)
}

async function transpileAsFile(
  source: string,
  option: Option
): Promise<string> {

  const source_ = (await import('fire-keeper/source_')).default

  const _listSource = [
    source,
    `${source}.coffee`,
    `${source}/index.coffee`,
  ]

  const [_source] = (await source_(_listSource))
    .filter(item => item.endsWith('.coffee'))
  if (!_source)
    throw new Error(`invalid source '${source}'`)

  const { read_, write_ } = await import('./file')
  const content = await read_(_source)

  const result = start(content, option)

  if (option.verbose) {
    if (option.displayCoffeescriptAst)
      console.log(result.raw)
    log(result.ast)
  }

  if (option.save)
    await write_(_source, result, option)

  return result.content
}

function transpileAsText(
  content: string,
  option: Option
): string {

  const result = start(content, option)

  if (option.verbose) {
    if (option.displayCoffeescriptAst)
      console.log(result.raw)
    log(result.ast)
  }

  return result.content
}

// export
export default main_
