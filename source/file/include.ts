import getDirname from 'fire-keeper/getDirname'
import iconv from 'iconv-lite'
import last from 'lodash/last'
import read_ from 'fire-keeper/read_'
import source_ from 'fire-keeper/source_'
import trim from 'lodash/trim'

// function

function decode({
  content, entry, source,
}: {
  content: Buffer | string
  entry: string
  source: string
}): string {

  if (source.endsWith('.coffee')) {
    if (!entry) return content as string
    // closure
    const list = (content as string)
      .split(/\n/u)
      .map(line => `  ${line}`)
    list.unshift(`${entry} = do ->`)
    return list.join('\n')
  }

  if (source.endsWith('.ahk')) {
    const cont = iconv.decode(content as Buffer, 'utf8', {
      addBOM: true,
    })
    return `\`\`\`${cont}\`\`\``
  }

  throw new Error(`invalid source '${source}'`)
}

async function getListSource_(
  input: string
): Promise<string[]> {

  if (input.endsWith('.ahk') || input.endsWith('.coffee'))
    return source_(input)

  let list = await source_(`${input}.coffee`)
  if (!list.length) list = await source_(`${input}/index.coffee`)
  if (!list.length) {
    const name = last(input.split('/'))
    const pkg = await read_(`./node_modules/${name}/package.json`) as {
      main: string
    }
    if (pkg && pkg.main)
      list = await source_(`./node_modules/${name}/${pkg.main}`)
  }

  return list
}

async function load_({
  entry, path, source,
}: {
  entry: string
  path: string
  source: string
}): Promise<string> {

  if (entry && path.includes('*'))
    throw new Error(`unable to set entry for batch import: import ${entry} from ${path}`)

  if (entry.includes('{'))
    throw new Error(`cannot use deconstructed import: import ${entry} from ${path}`)

  const _path = trim(path, '\'" ')

  const filepath = [
    getDirname(source),
    _path,
  ].join('/')

  const listSource = await getListSource_(filepath)
  if (!listSource.length) throw new Error(`invalid source ${path}`)
  const listResult: string[] = []

  for (const src of listSource) {

    // eslint-disable-next-line no-await-in-loop
    const content = await read_(src) as string

    listResult.push(
      content.includes('import ')
        // eslint-disable-next-line no-await-in-loop
        ? await main_(content, src)
        : decode({ content, entry, source: src })
    )
  }

  return listResult.join('\n')
}

async function main_(
  content: string,
  source: string,
): Promise<string> {

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

    // eslint-disable-next-line no-await-in-loop
    listResult.push(await load_({ entry, path, source }))
  }

  return listResult.join('\n')
}

// export
export default main_