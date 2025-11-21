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

  const lines = replaced.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line) {
      i++
      continue
    }
    const trimmed = line.trim()
    // 只处理 export 开头的行
    if (!trimmed.startsWith('export ')) {
      codeLines.push(line)
      i++
      continue
    }

    // export default foo 或 export default ->
    const exportDefaultMatch = /^export\s+default\s+(.+)/.exec(trimmed)
    if (exportDefaultMatch?.[1]) {
      // 判断是否为多行缩进块
      const exportLineIndent = RegExp(/^(\s*)/).exec(line)?.[1] ?? ''
      const exportBody = [exportDefaultMatch[1]]
      let j = i + 1
      while (j < lines.length) {
        const nextLine = lines[j]
        if (!nextLine) break
        if (
          nextLine.trim() === '' ||
          nextLine.startsWith(`${exportLineIndent} `) ||
          nextLine.startsWith(`${exportLineIndent}\t`)
        ) {
          exportBody.push(nextLine.slice(exportLineIndent.length))
          j++
        } else break
      }
      exportDefault.push(exportBody.join('\n').trim())
      i = j
      continue
    }

    // export {a, b} or export {a: foo()}
    const exportNamedMatch = /^export\s*{(.+)}/.exec(trimmed)
    if (exportNamedMatch?.[1]) {
      exportNamedMatch[1].split(',').forEach((pair) => {
        const seg = pair.trim()
        if (!seg) return
        exportNamed.push(seg)
      })
      i++
      continue
    }

    // 其他 export 忽略
    i++
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

  // 检查是否有 class 声明
  const codeBody = codeLines.join('\n')
  const hasClass = /^\s*class\s+\w+/m.test(codeBody)
  const hasExport = exportDefault.length > 0 || exportNamed.length > 0

  if (hasClass && hasExport) {
    throw new Error(
      `ahk/file: module contains both class and export: '${file}'`,
    )
  }

  if (hasClass && !hasExport) {
    // 仅有 class，直接输出 class 代码
    cache.set(file, { ...meta, content: codeBody, dependencies: deps })
    return
  }

  // 组装 return 语句
  const returnLine = run(() => {
    // default 和命名导出共存
    if (exportDefault.length && exportNamed.length) {
      const namedObj = exportNamed
        .map((s) => (s.includes(':') ? s : `${s}: ${s}`))
        .join(', ')
      return `return { default: ${exportDefault[0]}, ${namedObj} }`
    }

    // 只导出 default
    if (exportDefault.length) return `return { default: ${exportDefault[0]} }`

    if (exportNamed.length) {
      const namedObj = exportNamed
        .map((s) => (s.includes(':') ? s : `${s}: ${s}`))
        .join(', ')
      return `return { ${namedObj} }`
    }

    // 没有任何导出
    return ''
  })

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
  throw new Error(
    `ahk/file: unsupported file type for transformation: '${file}'`,
  )
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
