import $ from 'fire-keeper'
import _ from 'lodash'
import iconv from 'iconv-lite'

// variable

const tag = [
  '# include',
  'import '
]

// function

function decode({
  content, importer, source
}: {
  content: Buffer | string
  importer: string
  source: string
}): string {

  if (source.endsWith('.coffee')) {
    if (!importer) return content as string
    // closure
    const list = (content as string)
      .split(/\n/)
      .map(line => `  ${line}`)
    list.unshift(`${importer} = do ->`)
    return list.join('\n')
  }

  if (source.endsWith('.txt'))
    return '```' + content + '```'

  if (source.endsWith('.ahk')) {
    content = iconv.decode(content as Buffer, 'utf8', {
      addBOM: true
    })
    return '```' + content + '```'
  }

  return '```' + content + '```'
}

async function load_({
  importer, path, source
}: {
  importer: string
  path: string
  source: string
}): Promise<string> {

  path = _.trim(path, '\'" ')

  const filepath = [
    $.getDirname(source),
    '/',
    path,
    (_.last(path.split('/')) as string).includes('.') ? '' : '.coffee'
  ].join('')

  const listSource = await $.source_(filepath)
  const listResult: string[] = []

  for (const source of listSource) {

    const content = await $.read_(source) as string

    listResult.push(
      content.includes(tag[0]) || content.includes(tag[1])
        ? await main_(content, source)
        : decode({ content, importer, source })
    )
  }

  return listResult.join('\n')
}

async function main_(
  content: string,
  source: string
): Promise<string> {

  const listContent = content.split('\n')

  const listResult: string[] = []
  for (const line of listContent) {

    if (!(line.startsWith(tag[0]) || line.startsWith(tag[1]))) {
      listResult.push(line)
      continue
    }

    const [importer, path] = line.startsWith(tag[0])
      ? [
        '',
        line
          .replace(tag[0], '')
          .trim()
      ]
      : line
        .replace(tag[1], '')
        .split(' from ')
        .map(it => it.trim())

    listResult.push(await load_({ importer, path, source }))
  }

  return listResult.join('\n')
}

// export
export default main_