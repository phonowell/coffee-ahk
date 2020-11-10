// import $ from 'fire-keeper'
import compile_ from '../source'

// function

async function main_(): Promise<void> {
  await compile_('./script/y/index.coffee', {
    salt: 'ahk',
    save: true,
    verbose: true
  })
}

// export
export default main_