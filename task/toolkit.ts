import compile_ from '../dist'

// function

async function main_(): Promise<void> {
  await compile_('./script/toolkit/index.coffee', {
    salt: 'toolkit',
    save: true,
    verbose: true
  })
}

// export
export default main_