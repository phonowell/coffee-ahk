import $type from 'fire-keeper/dist/type'
import cson from 'cson'
import getDirname from 'fire-keeper/dist/getDirname'
import glob from 'fire-keeper/dist/glob'
import iconv from 'iconv-lite'
import last from 'lodash/last'
import read from 'fire-keeper/dist/read'
import toJson from 'fire-keeper/dist/toJson'
import toString from 'fire-keeper/dist/toString'
import trim from 'lodash/trim'

// interface

type OptionDecode = {
  content: Buffer | string
  entry: string
  source: string
}

type OptionLoad = {
  entry: string
  path: string
  source: string
}

// function

const decode = ({ content, entry, source }: OptionDecode) => {
  // .ahk
  if (source.endsWith('.ahk') && content instanceof Buffer) {
    const cont = iconv.decode(content, 'utf8', { addBOM: true })
    return `\`\`\`${cont}\`\`\``
  }

  // .coffee
  if (source.endsWith('.coffee') && typeof content === 'string') {
    if (!entry) return content
    // closure
    const list = content.split(/\n/u).map(line => `  ${line}`)
    list.unshift(`${entry} = do ->`)
    return list.join('\n')
  }

  // .json .yaml
  if (source.endsWith('.json') || source.endsWith('.yaml')) {
    if (!entry) return `\`\`\`${content}\`\`\``
    const result = cson.stringify(toJson(content))
    return `${entry} = ${result.includes('\n') ? `\n${result}` : result}`
  }

  // .css .html .js .txt
  if (
    source.endsWith('.css') ||
    source.endsWith('.html') ||
    source.endsWith('.js') ||
    source.endsWith('.txt')
  ) {
    if (!entry) throw new Error(`invalid source '${source}': 1`)
    return [
      `${entry} = \`\`\`"`,
      '(',
      content.toString().replace(/"/g, '""'),
      ')"```',
    ].join('\n')
  }

  throw new Error(`invalid source '${source}': 2`)
}

const getListSource = async (input: string) => {
  let list: string[] =
    input.endsWith('.ahk') ||
    input.endsWith('.coffee') ||
    input.endsWith('.css') ||
    input.endsWith('.html') ||
    input.endsWith('.js') ||
    input.endsWith('.json') ||
    input.endsWith('.txt') ||
    input.endsWith('.yaml')
      ? await glob(input)
      : await glob(`${input}.coffee`)

  if (!list.length) list = await glob(`${input}/index.coffee`)
  if (!list.length) {
    const name = last(input.split('/'))
    const pkg = await read<{ main: string }>(
      `./node_modules/${name}/package.json`
    )
    if (pkg && pkg.main) list = await glob(`./node_modules/${name}/${pkg.main}`)
  }

  return list
}

const load = async ({ entry, path, source }: OptionLoad) => {
  // import xxx from 'xxx/*'
  if (entry && path.includes('*'))
    throw new Error(
      `unable to set entry for batch import: import ${entry} from '${path}'`
    )

  // import {xxx} from 'xxx'
  if (entry.includes('{'))
    throw new Error(
      `cannot use deconstructed import: import ${entry} from '${path}'`
    )

  const _path = trim(path, '\'" ')

  const filepath = [getDirname(source), _path].join('/')

  const listSource = await getListSource(filepath)
  if (!listSource.length) throw new Error(`invalid source '${path}': 3`)

  const listResult: string[] = []

  for (const src of listSource) {
    let content = await read<string>(src)
    if ($type(content) === 'object') content = toString(content)

    listResult.push(
      content.includes('import ')
        ? await main(content, src)
        : decode({ content, entry, source: src })
    )
  }

  return listResult.join('\n')
}

const main = async (content: string, source: string) => {
  const listContent = content.split('\n')

  const listResult: string[] = []
  for (const line of listContent) {
    if (!line.startsWith('import ')) {
      listResult.push(line)
      continue
    }

    const [entry, path] = line.includes(' from ')
      ? // import entry from path
        line
          .replace('import ', '')
          .split(' from ')
          .map(it => it.trim())
      : // import path
        ['', line.replace('import ', '').trim()]

    listResult.push(await load({ entry, path, source }))
  }

  return listResult.join('\n')
}

// export
export default main
