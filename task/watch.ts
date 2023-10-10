import { watch } from 'fire-keeper'

import c2a from '../src'

// function

const main = () => {
  process.on('uncaughtException', console.error)

  watch('./script/**/*.coffee', path =>
    c2a(path, {
      displayCoffeescriptAst: true,
      salt: 'ahk',
      verbose: true,
    }),
  )
}

// export
export default main
