import compile_ from '../source'

// function

async function main_(): Promise<void> {
  await compile_('./script/z/index.coffee', {
    salt: 'z',
    verbose: true
  })
}

// export
export default main_