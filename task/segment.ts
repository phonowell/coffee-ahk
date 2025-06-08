import { glob } from 'fire-keeper'

import c2a from '../src'

const main = async () => {
  const listSource = await glob('./script/segment/*.coffee')
  for (const source of listSource) {
    await c2a(source, {
      ast: true,
      insertTranspilerInformation: false,
      pickAnonymous: false,
      salt: 'salt',
      useBuiltIns: false,
    })
  }
}

export default main
