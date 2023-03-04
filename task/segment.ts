import $ from 'fire-keeper'

import c2a from '../source'

// function

const main = async () => {
  const listSource = await $.glob('./script/segment/*.coffee')
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

// export
export default main
