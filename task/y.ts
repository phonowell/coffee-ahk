import compile_ from '../source'

// function

async function main_(): Promise<void> {
  await compile_('./script/y/index.coffee', {
    salt: 'ahk',
    verbose: true
  })
}

// export
export default main_