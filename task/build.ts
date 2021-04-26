import $compile_ from 'fire-keeper/compile_'
import $remove_ from 'fire-keeper/remove_'

// function

const compile = async () => {

  await $compile_(
    './source/**/*.ts',
    './dist',
    {
      base: './source',
      minify: false,
    }
  )
}

const main = async () => {
  await prepare()
  await compile()
}

const prepare = async () => {
  await $remove_('./dist')
}

// export
export default main