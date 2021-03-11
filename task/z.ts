// import $ from 'fire-keeper'
import transpile from '../source'

// function

const main_ = async (): Promise<void> => {

  await transpile('./script/z', {
    displayCoffeescriptAst: true,
    salt: 'ahk',
    verbose: true,
  })
}

// export
export default main_