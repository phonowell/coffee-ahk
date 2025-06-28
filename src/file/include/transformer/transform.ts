import cson from 'cson'
import { getExtname, read, run } from 'fire-keeper'
import iconv from 'iconv-lite'

import { getCache as fetchCache, getCacheSalt as fetchSalt } from '../cache.js'
import { pickImport as resolveImport } from '../source-resolver.js'
import { closureCoffee as wrapClosure } from '../utils.js'

import { replaceAnchor as replaceMark } from './replace-anchor.js'

type Cache = ReturnType<typeof fetchCache>
type Meta = Cache extends Map<unknown, infer V> ? V : never

const handleAhk = (
  file: string,
  text: string,
  meta: Meta,
  cache: Cache,
  deps: string[],
) => {
  const result = ['```', text, '```'].join('\n')
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const parseExportsFromCoffee = (replaced: string) => {
  const exportDefault: string[] = []
  const exportNamed: string[] = []
  const codeLines: string[] = []

  for (const line of replaced.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('export ')) {
      codeLines.push(line)
      continue
    }
    // export default foo
    if (/^export\s+default\s+(.+)/.test(trimmed)) {
      const m = /^export\s+default\s+(.+)/.exec(trimmed)
      if (m) exportDefault.push(m[1].trim())
      continue
    }
    // export {a, b} or export {a: foo()}
    if (/^export\s*{(.+)}/.test(trimmed)) {
      const m = /^export\s*{(.+)}/.exec(trimmed)
      if (m) {
        m[1].split(',').forEach((pair) => {
          const seg = pair.trim()
          if (!seg) return
          exportNamed.push(seg)
        })
      }
    }
    // Other export statements are ignored for now
  }
  return { exportDefault, exportNamed, codeLines }
}

const handleCoffee = async (
  file: string,
  text: string,
  meta: Meta,
  cache: Cache,
  salt: string,
  deps: string[],
) => {
  const replaced = await replaceMark(file, text)
  const { exportDefault, exportNamed, codeLines } =
    parseExportsFromCoffee(replaced)

  // 组装 return 语句
  let returnLine = ''
  if (exportDefault.length && exportNamed.length) {
    // default 和命名导出共存
    const namedObj = exportNamed
      .map((s) => (s.includes(':') ? s : `${s}: ${s}`))
      .join(', ')
    returnLine = `return { default: ${exportDefault[0]}, ${namedObj} }`
  } else if (exportDefault.length) {
    // 只导出 default 也统一为对象
    returnLine = `return { default: ${exportDefault[0]} }`
  } else if (exportNamed.length) {
    const namedObj = exportNamed
      .map((s) => (s.includes(':') ? s : `${s}: ${s}`))
      .join(', ')
    returnLine = `return { ${namedObj} }`
  }

  if (returnLine) codeLines.push(returnLine)

  // 保证 return 语句缩进与模块体一致
  const closureBody = wrapClosure(codeLines.join('\n'))
  const result = [
    exportDefault.length || exportNamed.length
      ? `__${salt}_module_${meta.id}__ = do ->`
      : 'do ->',
    closureBody,
  ].join('\n')
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const handleJsonOrYaml = (
  file: string,
  text: string,
  meta: Meta,
  cache: Cache,
  salt: string,
  deps: string[],
) => {
  const jsonStr = cson.stringify(JSON.parse(text))
  const result = `__${salt}_module_${meta.id}__ = ${
    jsonStr.includes('\n') ? `\n${jsonStr}` : jsonStr
  }`
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const collectCoffeeDeps = async (
  file: string,
  text: string,
): Promise<string[]> => {
  const depSet = new Set<string>()
  for (const line of text.split('\n')) {
    if (!line.startsWith('import ')) continue
    const { path: depPath } = await resolveImport(file, line)
    depSet.add(depPath)
  }
  return Array.from(depSet)
}

const processFile = async (
  file: string,
  meta: Meta,
  cache: Cache,
  salt: string,
) => {
  if (meta.content) return

  // 读取文件内容，支持 Buffer、string、object
  const raw = await read<Buffer | string | object>(file)
  if (!raw) {
    cache.delete(file)
    return
  }

  const text = run(() => {
    if (raw instanceof Buffer)
      return iconv.decode(raw, 'utf8', { addBOM: true })
    if (typeof raw === 'string') return raw
    return JSON.stringify(raw)
  })

  // 获取文件扩展名
  const ext = getExtname(file)

  // 收集依赖，仅处理 .coffee 文件，去重
  let deps: string[] = []
  if (ext === '.coffee') deps = await collectCoffeeDeps(file, text)

  // 处理内容
  if (ext === '.ahk') {
    handleAhk(file, text, meta, cache, deps)
    return
  }
  if (ext === '.coffee') {
    await handleCoffee(file, text, meta, cache, salt, deps)
    return
  }
  if (ext === '.json' || ext === '.yaml') {
    handleJsonOrYaml(file, text, meta, cache, salt, deps)
    return
  }
  throw new Error(`不支持的文件类型: '${file}'`)
}

export const transformAll = async () => {
  const cache = fetchCache()
  const salt = fetchSalt()

  const filesToProcess = [...cache].filter(([, meta]) => !meta.content)
  for (const [file, meta] of filesToProcess)
    await processFile(file, meta, cache, salt)

  // 递归处理未完成的项
  if ([...cache].some(([, meta]) => !meta.content)) await transformAll()
}
