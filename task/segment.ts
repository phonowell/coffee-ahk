import { glob } from 'fire-keeper'

import c2a from '../src/index.js'

const main = async () => {
  const listSource = await glob('./script/segment/*.coffee')
  for (const source of listSource) {
    await c2a(source, {
      ast: true,
      metadata: false,
      anonymous: false,
      salt: 'salt',
      builtins: false,
    })
  }
}

export default main
