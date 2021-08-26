import $getDirname from 'fire-keeper/getDirname'
import $parseJson from 'fire-keeper/parseJson'
import $parseString from 'fire-keeper/parseString'
import $read from 'fire-keeper/read'
import $source from 'fire-keeper/source'
import $type from 'fire-keeper/type'
import cson from 'cson'
import iconv from 'iconv-lite'
import last from 'lodash/last'
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

const decode = ({
  content, entry, source,
}: OptionDecode) => {

  if (
    source.endsWith('.ahk')
    && typeof content !== 'string'
  ) {
    const cont = iconv.decode(content, 'utf8', { addBOM: true })
    return `\`\`\`${cont}\`\`\``
  }

  if (source.endsWith('.coffee') && typeof content === 'string') {
    if (!entry) return content
    // closure
    const list = content
      .split(/\n/u)
      .map(line => `  ${line}`)
    list.unshift(`${entry} = do ->`)
    return list.join('\n')
  }

  if (
    source.endsWith('.json')
    || source.endsWith('.yaml')
  ) {
    if (!entry) return `\`\`\`${content}\`\`\``
    const result = cson.stringify($parseJson(content))
    return `${entry} = ${result.includes('\n')
      ? `\n${result}`
      : result
      }`
  }

  if (
    source.endsWith('.css')
    || source.endsWith('.html')
    || source.endsWith('.js')
    || source.endsWith('.txt')
  ) {
    if (!entry) throw new Error(`invalid source '${source}'`)
    return [
      `${entry} = ''`,
      `\`\`\`${entry} =`,
      '(',
      content,
      ')```',
    ].join('\n')
  }

  throw new Error(`invalid source '${source}'`)
}

const getListSource = async (
  input: string,
) => {

  let list: string[] = []

  if (
    !input.endsWith('.ahk')
    || input.endsWith('.coffee')
    || input.endsWith('.css')
    || input.endsWith('.html')
    || input.endsWith('.js')
    || input.endsWith('.json')
    || input.endsWith('.txt')
    || input.endsWith('.yaml')
  ) list = await $source(input)
  else list = await $source(`${input}.coffee`)

  if (!list.length) list = await $source(`${input}/index.coffee`)
  if (!list.length) {
    const name = last(input.split('/'))
    const pkg = await $read<{ main: string }>(`./node_modules/${name}/package.json`)
    if (pkg && pkg.main)
      list = await $source(`./node_modules/${name}/${pkg.main}`)
  }

  return list
}

const load = async ({
  entry, path, source,
}: OptionLoad) => {

  // import xxx from 'xxx/*'
  if (entry && path.includes('*'))
    throw new Error(`unable to set entry for batch import: import ${entry} from ${path}`)

  // import {xxx} from 'xxx'
  if (entry.includes('{'))
    throw new Error(`cannot use deconstructed import: import ${entry} from ${path}`)

  const _path = trim(path, '\'" ')

  const filepath = [
    $getDirname(source),
    _path,
  ].join('/')

  const listSource = await getListSource(filepath)
  if (!listSource.length) throw new Error(`invalid source ${path}`)

  const listResult: string[] = []

  for (const src of listSource) {

    let content = await $read<string>(src)
    if ($type(content) === 'object')
      content = $parseString(content)

    listResult.push(
      content.includes('import ')
        ? await main(content, src)
        : decode({ content, entry, source: src })
    )
  }

  return listResult.join('\n')
}

const main = async (
  content: string,
  source: string,
) => {

  const listContent = content.split('\n')

  const listResult: string[] = []
  for (const line of listContent) {

    if (!(line.startsWith('import '))) {
      listResult.push(line)
      continue
    }

    const [entry, path] = line.includes(' from ')
      // import entry from path
      ? line
        .replace('import ', '')
        .split(' from ')
        .map(it => it.trim())
      // import path
      : [
        '',
        line
          .replace('import ', '')
          .trim(),
      ]

    listResult.push(await load({ entry, path, source }))
  }

  return listResult.join('\n')
}

// export
export default main