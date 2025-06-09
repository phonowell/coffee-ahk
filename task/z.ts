import c2a from '../src/index.js'

const main = async () => {
  await c2a('./script/z', {
    // displayCoffeescriptAst: true,
    metadata: false,
    // pickAnonymous: false,
    salt: 'ahk',
    // verbose: true,
  })
}

export default main
