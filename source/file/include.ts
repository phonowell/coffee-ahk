import cson from 'cson'
import getDirname from 'fire-keeper/dist/getDirname'
import getType from 'fire-keeper/dist/getType'
import glob from 'fire-keeper/dist/glob'
import iconv from 'iconv-lite'
import last from 'lodash/last'
import read from 'fire-keeper/dist/read'
import toJson from 'fire-keeper/dist/toJson'
import toString from 'fire-keeper/dist/toString'
import trim from 'lodash/trim'

// interface

type OptDecode = {
  entry: string
  path: string
  source: string
}

type OptLoad = {
  entry: string
  path: string
  root: string
}

// variable

const listExt = ['.ahk', '.coffee', '.json', '.yaml'] as const
const mapCacheDecode = new Map<string, number>()
const mapCacheRead = new Map<string, string | Buffer>()
let cacheSalt = ''
let idModule = 0

// function

const decode = (option: OptDecode) => {
  const { entry, path, source } = option

  if (mapCacheDecode.has(path)) {
    if (!entry) return ''
    return `${entry} = __${cacheSalt}_module_${mapCacheDecode.get(path)}__`
  }

  const content = mapCacheRead.get(path) || ''

  // .ahk
  if (source.endsWith('.ahk') && content instanceof Buffer) {
    mapCacheDecode.set(path, 0)
    const cont = iconv.decode(content, 'utf8', { addBOM: true })
    return `\`\`\`${cont}\`\`\``
  }

  // .coffee
  if (source.endsWith('.coffee') && typeof content === 'string') {
    if (!entry) {
      mapCacheDecode.set(path, 0)
      return content
    }
    // closure
    const id = ++idModule
    mapCacheDecode.set(path, id)
    const list = content.split(/\n/u).map(line => `  ${line}`)
    list.unshift(`__${cacheSalt}_module_${id}__ = do ->`)
    list.push(`${entry} = __${cacheSalt}_module_${id}__`)
    return list.join('\n')
  }

  // .json .yaml
  if (source.endsWith('.json') || source.endsWith('.yaml')) {
    if (!entry) {
      mapCacheDecode.set(path, 0)
      return ''
    }
    // closure
    const id = ++idModule
    mapCacheDecode.set(path, id)
    const result = cson.stringify(toJson(content))
    return [
      `__${cacheSalt}_module_${id}__ = ${
        result.includes('\n') ? `\n${result}` : result
      }`,
      `${entry} = __${cacheSalt}_module_${id}__`,
    ].join('\n')
  }

  throw new Error(`invalid source '${source}'`)
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

const load = async (option: OptLoad) => {
  const { entry, path, root } = option

  if (path.includes('*')) throw new Error(`cannot use '*' in '${path}'`)

  const filepath = [getDirname(root), trim(path, '\'" ')].join('/')

  const source = await getSource(filepath)
  if (!source) throw new Error(`invalid source '${filepath}'`)

  const listResult: string[] = []

  if (!mapCacheRead.has(path)) {
    const content = await read<string>(source)
    if (!content) throw new Error(`invalid source '${source}'`)
    mapCacheRead.set(
      path,
      getType(content) === 'object' ? toString(content) : content
    )
  }
  const content = mapCacheRead.get(path) || ''

  listResult.push(
    typeof content == 'string' && content.includes('import ')
      ? await main(source, cacheSalt)
      : decode({ entry, path, source })
  )

  return listResult.join('\n')
}

const main = async (source: string, salt: string) => {
  const content = await read<string>(source)
  if (!content) throw new Error(`invalid source '${source}'`)

  cacheSalt = salt
  const listContent = content.split('\n')

  const listResult: string[] = []
  for (const line of listContent) {
    if (!line.startsWith('import ')) {
      listResult.push(line)
      continue
    }

    const [entry, path] = line.includes(' from ')
      ? // import entry from path
        line
          .replace('import ', '')
          .split(' from ')
          .map(it => it.trim())
      : // import path
        ['', line.replace('import ', '').trim()]

    listResult.push(await load({ entry, path, root: source }))
  }

  return listResult.join('\n')
}

// export
export default main
