import $source from 'fire-keeper/source'
import c2a from '../source'

// function

const main = async () => {

  await Promise.all(
    (await $source('./script/segment/*.coffee')).map(
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