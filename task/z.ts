// import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {
  await compile_('./script/z/index.coffee', {
    save: true,
    verbose: true
  })
}

// export
export default main_