import { argv, echo, read, write } from 'fire-keeper'

import c2aViaTs from '../../dist/index.js'

const TIMEOUT_MS = 10000

export type TestFailure = {
  source: string
  actual: string
  expected: string
}

const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  name: string,
): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${name} exceeded ${ms}ms`)), ms),
    ),
  ])

export const compileFixture = async (source: string) =>
  (
    (await c2aViaTs(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })) ?? ''
  )
    .replace(/\r/g, '')
    .trim()

export const runFixtureTest = async (
  source: string,
): Promise<TestFailure | null> => {
  const fixture = source.replace('.coffee', '.ahk')

  const actual = await withTimeout(compileFixture(source), TIMEOUT_MS, source)
  const expected = ((await read(fixture)) ?? '')
    .toString()
    .replace(/\r/g, '')
    .trim()

  if (!actual || !expected) {
    return {
      source,
      actual: actual || '(empty)',
      expected: expected || '(empty fixture)',
    }
  }

  if (actual !== expected) return { source, actual, expected }
  return null
}

export const overwriteFixtureTest = async (source: string): Promise<boolean> => {
  const fixture = source.replace('.coffee', '.ahk')
  const content = await withTimeout(compileFixture(source), TIMEOUT_MS, source)

  if (!content) {
    echo(`⚠️ Empty output: ${source}`)
    return false
  }

  await write(fixture, content)
  return true
}

export const showFailures = (failures: TestFailure[]) => {
  echo('\nFailures:\n')
  for (const { source, actual, expected } of failures) {
    echo(`❌ ${source}`)

    const actualLines = actual.split('\n')
    const expectedLines = expected.split('\n')
    const maxLines = Math.max(actualLines.length, expectedLines.length)

    echo('--- DIFF (- expected, + actual) ---')
    for (let i = 0; i < Math.min(maxLines, 20); i++) {
      const a = actualLines[i] ?? ''
      const e = expectedLines[i] ?? ''
      if (a !== e) {
        if (e) echo(`- L${i + 1}: ${e}`)
        if (a) echo(`+ L${i + 1}: ${a}`)
      }
    }
    if (maxLines > 20) echo(`... and ${maxLines - 20} more lines`)
    echo('')
  }
}

export const pickTarget = async (): Promise<{
  target?: string
  isOverwrite: boolean
}> => {
  const a = await argv()
  const args = [a._[1], a.target, a.overwrite].filter(Boolean) as string[]

  const isOverwrite = args.includes('overwrite')
  const target = args.find((arg) => arg !== 'overwrite')

  return { target, isOverwrite }
}
