import watch from 'fire-keeper/dist/watch'

import c2a from '../source'

// function

const main = () => {
  process.on('uncaughtException', console.error)

  watch('./script/**/*.coffee', async path =>
    c2a(path, {
      displayCoffeescriptAst: true,
      salt: 'ahk',
      verbose: true,
    }),
  )
}

// export
export default main
