import $ from 'fire-keeper'
// import iconv from 'iconv-lite'

import { read_ } from './file'
import format from './prettier'
// import transpile_ from './transpiler'

// interface

// function

async function compile_(
  source: string
): Promise<void> {

  const content = await read_(source)
  $.i(format(content))

  // let result = await transpile_(content, option)
  // result = iconv.encode(result, 'utf8', {
  //   addBOM: true
  // }).toString()

  // await write_(source, result)
}

async function main_(
  source: string[] | string
): Promise<void> {

  const listSource = await $.source_(source)
  if (!listSource.length) {
    $.info(`found no script(s) from '${source}'`)
    return
  }

  for (const source of listSource)
    await compile_(source)
}

// export
export default main_