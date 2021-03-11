import $watch from 'fire-keeper/watch'
import c2a from '../source'

// function

const main = (): void => {

  process.on('uncaughtException', console.error)

  $watch('./script/**/*.coffee', async (e: { path: string }) =>
    c2a(e.path, {
      displayCoffeescriptAst: true,
      salt: 'ahk',
      verbose: true,
    })
  )
}

// export
export default main