import c2a from '../source'

// function

const main = async () => {
  await c2a('./script/z', {
    // displayCoffeescriptAst: true,
    // pickAnonymous: false,
    salt: 'ahk',
    // verbose: true,
  })
}

// export
export default main
