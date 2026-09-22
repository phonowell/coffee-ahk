import { argv, exec } from 'fire-keeper'

export default async () => {
  const a = await argv()
  const raw = a._.map(String)

  const isOverwrite = raw.includes('overwrite')
  const target = raw.find((it) => !['test', 'overwrite', '--'].includes(it))

  if (isOverwrite) process.env.UPDATE_FIXTURES = '1'
  if (target) process.env.TEST_TARGET = target

  const [code] = await exec('vitest run')
  if (code) throw new Error(`vitest exited with code ${code}`)
}
