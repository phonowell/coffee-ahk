import cson from 'cson'
import getDirname from 'fire-keeper/dist/getDirname'
import glob from 'fire-keeper/dist/glob'
import iconv from 'iconv-lite'
import last from 'lodash/last'
import normalizePath from 'fire-keeper/dist/normalizePath'
import read from 'fire-keeper/dist/read'
import toJson from 'fire-keeper/dist/toJson'
import toString from 'fire-keeper/dist/toString'
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

const getSource = async (input: string) => {
  const isInListExt = listExt.some(ext => input.endsWith(ext))
  let list = isInListExt ? await glob(input) : await glob(`${input}.coffee`)

  if (!list.length) list = await glob(`${input}/index.coffee`)
  if (!list.length) {
    const name = last(input.split('/'))
    const pkg = await read<{ main: string }>(
      `./node_modules/${name}/package.json`
    )
    if (pkg && pkg.main) list = await glob(`./node_modules/${name}/${pkg.main}`)
  }

  return list[0]
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

  const src = await getSource(
    normalizePath([getDirname(source), trim(path, '\'" ')].join('/'))
  )
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
  listReady: string[] = []
): string[] => {
  ;[...cache].forEach(item => {
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
        const jstring = cson.stringify(toJson(before))
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
