import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {

  async function sub_(
    source: string,
  ): Promise<void> {

    await compile_(source, {
      ast: true,
      insertTranslatorInformation: false,
      pickAnonymous: false,
      salt: 'salt',
      verbose: true,
    })
  }

  await Promise.all(
    (await $.source_('./script/segment/*.coffee'))
      .map(sub_)
  )
}

// export
export default main_
