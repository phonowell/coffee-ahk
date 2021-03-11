import $compile_ from 'fire-keeper/compile_'
import $remove_ from 'fire-keeper/remove_'

// function

const compile_ = async (): Promise<void> => {

  await $compile_(
    './source/**/*.ts',
    './dist',
    {
      base: './source',
      minify: false,
    }
  )
}

const main_ = async (): Promise<void> => {
  await prepare_()
  await compile_()
}

const prepare_ = async (): Promise<void> => {
  await $remove_('./dist')
}

// export
export default main_