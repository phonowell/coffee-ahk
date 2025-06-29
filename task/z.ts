import c2a from '../src/index.js'

const main = async () => {
  await c2a('./script/z/index.coffee', {
    ast: true,
    salt: 'ahk',
  })
}

export default main
