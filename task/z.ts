// import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {
  await compile_('./script/test/index.coffee')
}

// export
export default main_