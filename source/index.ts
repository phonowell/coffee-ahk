import $ from 'fire-keeper'
import { read_, write_ } from './file'
import format from './formator'

// function

async function compile_(
  source: string
): Promise<void> {

  const content = await read_(source)
  await write_(source, format(content))
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