import c2a from '../source'
import watch from 'fire-keeper/dist/watch'

// function

const main = () => {

  process.on('uncaughtException', console.error)

  watch('./script/**/*.coffee', async (path) =>
    c2a(path, {
      displayCoffeescriptAst: true,
      salt: 'ahk',
      verbose: true,
    })
  )
}

// export
export default main