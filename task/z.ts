import c2a from '../src'

const main = async () => {
  await c2a('./script/z', {
    // displayCoffeescriptAst: true,
    insertTranspilerInformation: false,
    // pickAnonymous: false,
    salt: 'ahk',
    // verbose: true,
  })
}

export default main
