import { glob, write } from 'fire-keeper'
import { describe, expect, test } from 'vitest'

import { compileFixture, readFixture } from './helpers.js'

const target = process.env.TEST_TARGET
const update = process.env.UPDATE_FIXTURES === '1'

const sources = (await glob(`./script/test/${target || '*'}.coffee`)).filter(
  (f) => !f.includes('/error-'),
)

describe('e2e fixtures', () => {
  test.each(sources.map((s) => [s.match(/\/([\w-]+)\.coffee$/)?.[1] ?? s, s] as const))(
    '%s',
    async (_name, source) => {
      const actual = await compileFixture(source)
      expect(actual).not.toBe('')

      if (update) {
        await write(source.replace('.coffee', '.ahk'), actual)
        return
      }

      expect(actual).toBe(await readFixture(source))
    },
  )
})
