import start from './entry'
import log from './logger'

// interface

type Option = typeof optionDefault
export type OptionPartial = Partial<Option>

// variable

const optionDefault = {
  asText: false,
  ast: false,
  displayCoffeescriptAst: false,
  ignoreComment: true,
  insertTranspilerInformation: true,
  pickAnonymous: true,
  salt: '',
  save: true,
  useBuiltIns: true,
  verbose: false,
}

// function

const generatedSalt = (): string =>
  Math.random().toString(32).split('.')[1].padStart(11, '0')

const main = async (
  source: string,
  option: OptionPartial = {},
): Promise<string> => {
  const option2 = {
    ...optionDefault,
    ...option,
  }

  // salt
  if (!option2.salt) option2.salt = generatedSalt()

  if (option2.asText) return transpileAsText(source, option2)
  return transpileAsFile(source, option2)
}

const transpileAsFile = async (
  source: string,
  option: Option,
): Promise<string> => {
  const glob = (await import('fire-keeper/dist/glob')).default

  const listSource = [source, `${source}.coffee`, `${source}/index.coffee`]

  const [source2] = (await glob(listSource)).filter(item =>
    item.endsWith('.coffee'),
  )
  if (!source2) throw new Error(`invalid source '${source}'`)

  const { read, write } = await import('./file')
  const content = await read(source2, option.salt)

  const result = start(content, option)

  if (option.verbose) {
    if (option.displayCoffeescriptAst) console.log(result.raw)
    log(result.ast)
  }

  if (option.save) await write(source2, result, option)

  return result.content
}

const transpileAsText = (content: string, option: Option): string => {
  const result = start(content, option)

  if (option.verbose) {
    if (option.displayCoffeescriptAst) console.log(result.raw)
    log(result.ast)
  }

  return result.content
}

// export
export default main
