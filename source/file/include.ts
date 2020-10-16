import $ from 'fire-keeper'
import _ from 'lodash'
import iconv from 'iconv-lite'

// variable

const tag = '# include'

// function

function decode(
  source: string,
  content: Buffer | string
): string {

  if (source.endsWith('.coffee'))
    return content as string

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

async function load_(
  name: string,
  source: string
): Promise<string> {

  name = _.trim(name, '\'" ')

  const path = [
    $.getDirname(source),
    '/',
    name,
    (_.last(name.split('/')) as string).includes('.') ? '' : '.coffee'
  ].join('')

  const listSource = await $.source_(path)
  const listResult: string[] = []

  for (const source of listSource) {
    const content = await $.read_(source) as string
    listResult.push(
      content.includes(tag)
        ? await main_(content, source)
        : decode(source, content)
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

    if (!line.startsWith(tag)) {
      listResult.push(line)
      continue
    }

    const name = line
      .replace(tag, '')
      .trim()

    listResult.push(await load_(name, source))
  }

  return listResult.join('\n')
}

// export
export default main_