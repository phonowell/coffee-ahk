import c2a from '../src/index.js'

const main = async () => {
  await c2a('./script/z/index.coffee', {
    ast: true,
    comments: true,
    metadata: false,
    salt: 'ahk',
  })
}

export default main
