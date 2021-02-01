import $ from 'fire-keeper'
import transpile from '../source'

// function

async function main_(): Promise<void> {

  await Promise.all(
    (await $.source_('./script/segment/*.coffee')).map(
      source => transpile(source, {
        ast: true,
        insertTranspilerInformation: false,
        pickAnonymous: false,
        salt: 'salt',
        verbose: true,
      })
    )
  )
}

// export
export default main_
