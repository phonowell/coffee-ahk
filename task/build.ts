import $compile from 'fire-keeper/compile'
import $remove from 'fire-keeper/remove'

// function

const compile = async () => {

  await $compile(
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
  await $remove('./dist')
}

// export
export default main