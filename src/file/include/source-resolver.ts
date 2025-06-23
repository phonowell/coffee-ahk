// Source path resolution functions
import { getDirname, glob, read } from 'fire-keeper'
import { trim } from 'radash'

import { listExt } from './utils.js'

export const getSource = async (source: string, path: string) => {
  const isFile = path.startsWith('.')
  const isInListExt = listExt.some((ext) => path.endsWith(ext))

  const group = isInListExt
    ? [path]
    : [`${path}.coffee`, `${path}/index.coffee`]

  group.forEach((it, i) => {
    group[i] = isFile ? `${source}/${it}` : `./node_modules/${it}`
  })
  const listResult = await glob(group)
  if (listResult.length) return listResult[0]

  const pkg = await read<{ main: string }>(
    `./node_modules/${path}/package.json`,
  )
  if (!pkg?.main) throw new Error(`invalid package '${source}'`)

  const listResult2 = await glob(`./node_modules/${path}/${pkg.main}`)
  if (!listResult2.length) throw new Error(`invalid package '${source}'`)

  return listResult2[0]
}

export const pickImport = async (source: string, line: string) => {
  const [entry, path] = line.includes(' from ')
    ? // import entry from path
      line
        .replace('import ', '')
        .split(' from ')
        .map((it) => it.trim())
    : // import path
      ['', line.replace('import ', '').trim()]

  const src = await getSource(getDirname(source), trim(path, ' /\'"'))
  return [entry, src]
}
