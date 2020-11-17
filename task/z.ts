import compile_ from '../dist'

// function

async function main_(): Promise<void> {
  await compile_('./script/z/index.coffee', {
    save: true
  })
}

// export
export default main_