import { argv, echo, glob, read, write } from 'fire-keeper'

import c2aViaTs from '../../src/index.js'

const TIMEOUT_MS = 10000 // 10 seconds per test

const withTimeout = <T>(promise: Promise<T>, ms: number, name: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${name} exceeded ${ms}ms`)), ms)
    ),
  ])

const compile = async (source: string) =>
  (
    (await c2aViaTs(source, {
      metadata: false,
      salt: 'ahk',
      save: false,
    })) ?? ''
  )
    .replace(/\r/g, '')
    .trim()

type TestFailure = {
  source: string
  actual: string
  expected: string
}

/** 执行单个测试（用于验证模式） */
const runTest = async (source: string): Promise<TestFailure | null> => {
  const fixture = source.replace('.coffee', '.ahk')

  const actual = await withTimeout(compile(source), TIMEOUT_MS, source)
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

  if (actual !== expected) {
    return { source, actual, expected }
  }

  return null // Passed
}

/** 执行单个测试（用于覆写模式） */
const overwriteTest = async (source: string): Promise<boolean> => {
  const fixture = source.replace('.coffee', '.ahk')
  const content = await withTimeout(compile(source), TIMEOUT_MS, source)

  if (!content) {
    echo(`⚠️ Empty output: ${source}`)
    return false
  }

  await write(fixture, content)
  return true
}

/** 显示失败详情 */
const showFailures = (failures: TestFailure[]) => {
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

const main = async () => {
  const startTime = Date.now()
  const target = await pickTarget()

  // Run end-to-end tests
  echo('\n' + '='.repeat(60))
  echo('1️⃣  END-TO-END TESTS')
  echo('='.repeat(60))

  const pattern = `./script/test/${
    !!target && target !== 'overwrite' ? target : '*'
  }.coffee`
  const listSource = (await glob(pattern)).filter((f) => !f.includes('/error-'))

  let passed = 0
  let failed = 0
  const failures: TestFailure[] = []

  // Overwrite mode: 顺序执行所有测试，覆写 fixture
  if (target === 'overwrite') {
    for (const source of listSource) {
      const success = await overwriteTest(source)
      success ? passed++ : failed++
    }
  } else {
    // Verify mode: import 测试串行执行（共享模块缓存），其他测试并行执行
    const importTests = listSource.filter((s) => s.includes('/import'))
    const parallelTests = listSource.filter((s) => !s.includes('/import'))

    // 串行执行 import 测试
    for (const source of importTests) {
      const result = await runTest(source)
      if (result === null) {
        passed++
      } else {
        failed++
        failures.push(result)
      }
    }

    // 并行执行其他测试
    const results = await Promise.all(parallelTests.map(runTest))
    for (const result of results) {
      if (result === null) {
        passed++
      } else {
        failed++
        failures.push(result)
      }
    }
  }

  echo(`Total: ${listSource.length} | Passed: ${passed} | Failed: ${failed}`)

  if (failures.length > 0) {
    showFailures(failures)

    // 输出失败报告
    const failReport = [
      `# Test Report (FAILED) - ${new Date().toISOString()}`,
      `- End-to-end: ${passed}/${listSource.length} (${failed} failed)`,
      `- Failures:`,
      ...failures.map((f) => `  - ${f.source}`),
    ].join('\n')
    await write('./test-report.md', failReport)
    throw new Error(`${failed} end-to-end test(s) failed`)
  }

  echo('✅ All end-to-end tests passed!')

  // overwrite 模式跳过后续测试
  if (target === 'overwrite') {
    return
  }

  // Run unit tests
  let unitTestCount = 0
  let errorTestCount = 0
  let coveragePercent = '0.0'

  echo('\n' + '='.repeat(60))
  echo('2️⃣  UNIT TESTS (Core Models)')
  echo('='.repeat(60))

  try {
    const testUnit = await import('./unit.js')
    unitTestCount = await testUnit.default()
  } catch (error) {
    echo('❌ Unit tests failed')
    throw error
  }

  // Run error tests
  echo('\n' + '='.repeat(60))
  echo('3️⃣  ERROR SCENARIO TESTS')
  echo('='.repeat(60))

  try {
    const testErrors = await import('./errors.js')
    errorTestCount = await testErrors.default()
  } catch (error) {
    echo('❌ Error tests failed')
    throw error
  }

  // Run coverage analysis
  echo('\n' + '='.repeat(60))
  echo('4️⃣  COVERAGE ANALYSIS')
  echo('='.repeat(60))

  try {
    const testCoverage = await import('./coverage.js')
    coveragePercent = await testCoverage.default()
  } catch (error) {
    echo('❌ Coverage analysis failed')
    throw error
  }

  // Final summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
  echo('\n' + '='.repeat(60))
  echo('🎉 ALL TESTS PASSED!')
  echo('='.repeat(60))
  echo(`✅ End-to-end: ${passed}/${listSource.length}`)
  echo(`✅ Unit tests: ${unitTestCount}/${unitTestCount}`)
  echo(`✅ Error scenarios: ${errorTestCount}/${errorTestCount}`)
  echo(`📊 Coverage: ${coveragePercent}%`)
  echo(`⏱️  Time: ${elapsed}s`)
  echo('='.repeat(60) + '\n')

  // 输出测试结果到文件
  const report = [
    `# Test Report - ${new Date().toISOString()}`,
    `- End-to-end: ${passed}/${listSource.length}`,
    `- Unit tests: ${unitTestCount}`,
    `- Error scenarios: ${errorTestCount}`,
    `- Coverage: ${coveragePercent}%`,
    `- Time: ${elapsed}s`,
  ].join('\n')
  await write('./test-report.md', report)
}

const pickTarget = async () => {
  const a = await argv()
  return a._[1] ?? a.target
}

export default main
