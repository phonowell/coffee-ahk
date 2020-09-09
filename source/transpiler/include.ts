import $ from 'fire-keeper'

import { getDepth } from './fn'

// interface

import { Option } from '../type'

// function

async function main_(
  content: string,
  option: Option
): Promise<string> {

  // format
  const listContent = content
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .split('\n')

  const listResult: string[] = []

  for (const line of listContent) {

    if (getDepth(line)) {
      listResult.push(line)
      continue
    }

    if (!line.startsWith('# include')) {
      listResult.push(line)
      continue
    }

    const source = [
      $.getDirname(option.path),
      '/',
      line
        .replace(/# include/, '')
        .trim(),
      '.coffee'
    ].join('')

    let cont = ''
    if (source.includes('*')) {
      const listCont: string[] = []
      for (const src of await $.source_(source))
        listCont.push(await $.read_(src) as string)
      cont = listCont.join('\n')
    } else
      cont = await $.read_(source) as string

    listResult.push(
      cont.includes('# include')
        ? await main_(cont, option)
        : cont
    )
  }

  return listResult
    .join('\n')
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
}

// export
export default main_