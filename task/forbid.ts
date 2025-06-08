import { read, write } from 'fire-keeper'

const main = async () => {
  const content = await read('./data/forbidden.yaml')
  await write('./data/forbidden.json', content)
}

export default main
