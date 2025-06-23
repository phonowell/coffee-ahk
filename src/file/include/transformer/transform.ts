// Content transformation functions
import cson from 'cson'
import { read } from 'fire-keeper'
import iconv from 'iconv-lite'

import { getCache, getCacheSalt } from '../cache.js'
import { pickImport } from '../source-resolver.js'
import { closureCoffee, contentIncludes } from '../utils.js'

import { replaceAnchor } from './replace-anchor.js'

export const transform = async () => {
  const cache = getCache()
  const cacheSalt = getCacheSalt()

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
      return JSON.stringify(content)
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
      if (source.endsWith('.ahk')) return ['```', before, '```'].join('\n')

      if (source.endsWith('.coffee')) {
        if (!contentIncludes(before, 'export ')) return before
        return [
          `__${cacheSalt}_module_${data.id}__ = do ->`,
          closureCoffee(before),
        ].join('\n')
      }
      if (source.endsWith('.json') || source.endsWith('.yaml')) {
        const jstring = cson.stringify(JSON.parse(before))
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
  if ([...cache].filter((item) => !item[1].content).length) await transform()
}
