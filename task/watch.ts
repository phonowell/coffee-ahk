import $ from 'fire-keeper'
import transpile from '../source'

// function

async function main(): Promise<void> {

  process.on('uncaughtException', console.error)

  $.watch('./script/**/*.coffee', async (e: { path: string }) =>
    transpile(e.path, {
      displayCoffeescriptAst: true,
      salt: 'ahk',
      verbose: true,
    })
  )
}

// export
export default main