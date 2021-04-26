import $source_ from 'fire-keeper/source_'
import c2a from '../source'

// function

const main = async () => {

  await Promise.all(
    (await $source_('./script/segment/*.coffee')).map(
      source => c2a(source, {
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
export default main