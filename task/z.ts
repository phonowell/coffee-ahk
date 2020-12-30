import $ from 'fire-keeper'
import transpile from '../source'

// function

async function main_(): Promise<void> {

  const ahk = "a = 'ahk'"
  $.i(await transpile(ahk, { asText: true }))
}

// export
export default main_
