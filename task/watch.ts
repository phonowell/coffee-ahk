import $ from 'fire-keeper'
import transpile from '../source'

// function

async function main(): Promise<void> {

  process.on('uncaughtException', console.error)

  $.watch('./script/**/*.coffee', async (e: { path: string }) =>
    transpile(e.path, {
      salt: 'ahk',
    })
  )
}

// export
export default main
