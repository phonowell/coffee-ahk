import compile_ from '../dist'

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