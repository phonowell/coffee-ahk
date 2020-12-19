import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {

  const listSource = await $.source_('./script/segment/*.coffee')
  for (const source of listSource) {
    await compile_(source, {
      ast: true,
      insertTranslatorInformation: false,
      pickAnonymous: false,
      salt: 'salt',
      verbose: true
    })
  }
}

// export
export default main_