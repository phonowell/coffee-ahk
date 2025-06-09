import { exec, read, remove, write } from 'fire-keeper'

const cleanup = () => remove('./dist')

const genForbiddens = async () => {
  const content = await read('./data/forbidden.yaml')
  await write('./data/forbidden.json', content)
}

const main = async () => {
  await exec('pnpm i')
  await cleanup()
  await genForbiddens()
}

export default main
