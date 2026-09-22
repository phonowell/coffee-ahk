import { read } from 'fire-keeper'

import transpile from '../src/index.js'

export const compileFixture = async (source: string) =>
  (
    (await transpile(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })) ?? ''
  )
    .replace(/\r/g, '')
    .trim()

export const readFixture = async (source: string) =>
  (((await read(source.replace('.coffee', '.ahk'))) ?? '') as string)
    .toString()
    .replace(/\r/g, '')
    .trim()
