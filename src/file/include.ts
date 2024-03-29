import cson from 'cson'
import { glob, read, getDirname, toJSON, toString } from 'fire-keeper'
import iconv from 'iconv-lite'
import trim from 'lodash/trim'

// variable

const cache = new Map<
  string,
  {
    id: number
    content: string
    dependencies: string[]
  }
>()

const listExt = ['.ahk', '.coffee', '.json', '.yaml'] as const
let cacheSalt = ''
let idModule = 0

// function

const closureCoffee = (content: string) =>
  content
    .split(/\n/u)
    .map(line => `  ${line}`)
    .join('\n')

const contentIncludes = (content: string, target: string) => {
  const listContent = content.split('\n')
  for (const line of listContent) {
    if (line.startsWith(target)) return true
  }
  return false
}

const getSource = async (source: string, path: string) => {
  const isFile = path.startsWith('.')
  const isInListExt = listExt.some(ext => path.endsWith(ext))

  const group = isInListExt
    ? [path]
    : [`${path}.coffee`, `${path}/index.coffee`]

  group.filter(
    (it, i) => (group[i] = isFile ? `${source}/${it}` : `./node_modules/${it}`),
  )
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

const main = async (source: string, salt: string) => {
  cacheSalt = salt

  const content = await read<string>(source)
  if (!content) throw new Error(`invalid source '${source}'`)

  const result = await replaceAnchor(source, content)
  await transform()
  return [...sortModules(), result].join('\n')
  // return [...[...cache].map(item => item[1].content), result].join('\n')
}

const pickImport = async (source: string, line: string) => {
  const [entry, path] = line.includes(' from ')
    ? // import entry from path
      line
        .replace('import ', '')
        .split(' from ')
        .map(it => it.trim())
    : // import path
      ['', line.replace('import ', '').trim()]

  const src = await getSource(getDirname(source), trim(path, ' /\'"'))
  return [entry, src]
}

const replaceAnchor = async (source: string, content: string) => {
  const listResult: string[] = []

  for (const line of content.split('\n')) {
    if (!line.startsWith('import ')) {
      listResult.push(line)
      continue
    }

    const [entry, path] = await pickImport(source, line)

    if (!cache.has(path))
      cache.set(path, {
        content: '',
        dependencies: [],
        id: entry ? ++idModule : 0,
      })

    const id = cache.get(path)?.id ?? 0
    if (!id) continue

    const anchor = entry ? `${entry} = __${cacheSalt}_module_${id}__` : ''
    if (anchor) listResult.push(anchor)
  }

  return listResult.join('\n')
}

const sortModules = (
  listContent: string[] = [],
  listReady: string[] = [],
): string[] => {
  const cache2 = [...cache]
  cache2.forEach(item => {
    const [source, { content, dependencies }] = item
    if (dependencies.length) return
    listContent.push(content)
    listReady.push(source)
    cache.delete(source)
  })
  if (!cache.size) return listContent
  ;[...cache].forEach(item => {
    const [source, { dependencies }] = item
    cache.set(source, {
      ...item[1],
      dependencies: dependencies.filter(it => !listReady.includes(it)),
    })
  })
  return sortModules(listContent, listReady)
}

const transform = async () => {
  for (const item of [...cache]) {
    const [source, data] = item
    if (data.content) continue

    const content = await read<Buffer | string | object>(source)
    if (!content) {
      cache.delete(source)
      continue
    }

    const before2 = (() => {
      if (content instanceof Buffer)
        return iconv.decode(content, 'utf8', { addBOM: true })
      if (typeof content === 'string') return content
      return toString(content)
    })()

    const dependencies = await (async () => {
      if (source.endsWith('.coffee')) {
        const list: string[] = []
        for (const line of before2.split('\n')) {
          if (!line.startsWith('import ')) continue
          const [, path] = await pickImport(source, line)
          list.push(path)
        }
        return list
      }
      return []
    })()

    const before = source.endsWith('.coffee')
      ? await replaceAnchor(source, before2)
      : before2

    // eslint-disable-next-line no-loop-func
    const after = (() => {
      if (source.endsWith('.ahk')) {
        return ['```', before, '```'].join('\n')
      }
      if (source.endsWith('.coffee')) {
        if (!contentIncludes(before, 'export ')) {
          // return ['do ->', closureCoffee(before)].join('\n')
          return before
        }
        return [
          `__${cacheSalt}_module_${data.id}__ = do ->`,
          closureCoffee(before),
        ].join('\n')
      }
      if (source.endsWith('.json') || source.endsWith('.yaml')) {
        const jstring = cson.stringify(toJSON(before))
        return `__${cacheSalt}_module_${data.id}__ = ${
          jstring.includes('\n') ? `\n${jstring}` : jstring
        }`
      }
      throw new Error(`invalid source '${source}'`)
    })()

    cache.set(source, {
      ...data,
      content: after,
      dependencies,
    })
  }
  if ([...cache].filter(item => !item[1].content).length) {
    await transform()
  }
}

// export
export default main
