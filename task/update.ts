import { exec } from 'fire-keeper'

// interface

type Result = {
  current: string
  latest: string
  wanted: string
  isDeprecated: boolean
  dependencyType: 'dependencies' | 'devDependencies'
}

// function

const main = async () => {
  const [, raw] = await exec('pnpm outdated --json')
  const result = JSON.parse(raw) as Record<string, Result>

  const listName = Object.entries(result)
    .filter(it => {
      const [, data] = it
      if (data.isDeprecated) return false
      return true
    })
    .map(it => it[0])
  if (!listName.length) return

  const listCmd = listName.map(name => `pnpm i ${name}@latest`)
  await exec(listCmd)
}

// export
export default main
