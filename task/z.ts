import c2a from '../src'

// function

const main = async () => {
  await c2a('./script/z', {
    displayCoffeescriptAst: true,
    insertTranspilerInformation: false,
    // pickAnonymous: false,
    salt: 'ahk',
    verbose: true,
  })
}

// export
export default main
