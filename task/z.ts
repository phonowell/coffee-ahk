import c2a from '../source'

// function

const main = async () => {
  await c2a('./script/z', {
    // displayCoffeescriptAst: true,
    insertTranspilerInformation: false,
    // pickAnonymous: false,
    salt: 'ahk',
    verbose: false,
  })
}

// export
export default main
