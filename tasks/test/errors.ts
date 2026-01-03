import { echo } from 'fire-keeper'
import start from '../../src/entry/index.js'

interface ErrorTest {
  name: string
  code: string
  expectedError: RegExp
}

const errorTests: ErrorTest[] = [
  // Forbidden formatter tests
  {
    name: 'Optional chaining (?.) is forbidden',
    code: 'x = obj?.prop',
    expectedError: /Coffee-AHK\/forbidden.*\?\..*not supported/i,
  },
  {
    name: 'Range operator (..) is forbidden',
    code: 'arr = [1..10]',
    expectedError: /Coffee-AHK\/forbidden.*\.\..*not supported/i,
  },
  {
    name: 'Post-if syntax is forbidden',
    code: 'return 1 if condition',
    expectedError: /Coffee-AHK\/forbidden.*post-if/i,
  },

  // Operator forbidden tests
  {
    name: 'Logical OR assignment (||=) is forbidden',
    code: 'x = 0\nx ||= 1',
    expectedError: /Coffee-AHK\/forbidden.*\|\|=/i,
  },
  {
    name: 'Floor division (//) is forbidden',
    code: 'x = 10 // 3',
    expectedError: /Coffee-AHK\/forbidden.*\/\/.*comment/i,
  },
  {
    name: 'in operator is forbidden',
    code: 'x = 1 in [1,2,3]',
    expectedError: /Coffee-AHK\/forbidden.*in.*not supported/i,
  },
  {
    name: 'delete operator is forbidden',
    code: 'delete obj.key',
    expectedError: /Coffee-AHK\/forbidden.*delete.*not supported/i,
  },
  {
    name: 'BigInt literal is forbidden',
    code: 'n = 123n',
    expectedError: /Coffee-AHK\/forbidden.*BigInt/i,
  },
  {
    name: 'Spread operator in object literal is forbidden',
    code: 'obj = { ...other }',
    expectedError: /Coffee-AHK\/forbidden.*spread operator/i,
  },

  // Variable name validation
  {
    name: 'AHK built-in function as class name is forbidden',
    code: 'class InStr\n  value: 1',
    expectedError: /Coffee-AHK\/forbidden.*class name.*forbidden/i,
  },
  {
    name: 'A_ prefix in assignment is forbidden',
    code: 'A_Index = 5',
    expectedError: /Coffee-AHK\/forbidden.*A_Index.*a_.*prefix/i,
  },
  {
    name: 'AHK built-in function as parameter is forbidden',
    code: 'fn = (InStr) -> InStr(a, b)',
    expectedError: /Coffee-AHK\/forbidden.*parameter.*InStr/i,
  },
  {
    name: 'A_ prefix in array destructuring is forbidden',
    code: '[A_Index, x] = arr',
    expectedError: /Coffee-AHK\/forbidden.*array destructuring target.*A_Index.*a_.*prefix/i,
  },
  {
    name: 'A_ prefix as catch variable is forbidden',
    code: 'try\n  x = 1\ncatch A_Index\n  console.log(A_Index)',
    expectedError: /Coffee-AHK\/forbidden.*catch variable.*A_Index/i,
  },

  // Unsupported language features
  {
    name: 'await is not supported',
    code: "fn = -> await fetch('url')",
    expectedError: /Coffee-AHK\/unsupported.*await.*not supported/i,
  },
  {
    name: 'for loop destructuring is not supported',
    code: 'for [a, b] in arr\n  a + b',
    expectedError: /Coffee-AHK\/unsupported.*for loop destructuring/i,
  },
  {
    name: 'nested array destructuring is not supported',
    code: '[a, [b, c]] = [1, [2, 3]]',
    expectedError: /Coffee-AHK\/unsupported.*nested array destructuring/i,
  },

  // Single-letter class name validation
  {
    name: 'Single-letter class name is forbidden',
    code: 'class A\n  a: 1',
    expectedError: /Coffee-AHK\/class-single-letter.*class name.*A.*single letter/i,
  },

  // Constructor parameter validation
  {
    name: '@property in constructor parameters is forbidden',
    code: 'class Animal\n  constructor: (@name) ->',
    expectedError: /Coffee-AHK\/invalid-syntax.*this\.name.*constructor parameters/i,
  },
]

const runTest = async (test: ErrorTest) => {
  try {
    const result = await start(test.code, {
      metadata: false,
      salt: 'ahk',
      comments: false,
      ast: false,
      coffeeAst: false,
      save: false,
      string: false,
      verbose: false,
    })
    return {
      passed: false,
      error: `Expected error: ${test.expectedError}\nBut compilation succeeded\nResult: ${result.content.substring(0, 100)}`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (test.expectedError.test(errorMessage)) {
      return { passed: true }
    }
    return {
      passed: false,
      error: `Expected: ${test.expectedError}\nGot: ${errorMessage.substring(0, 200)}`,
    }
  }
}

const main = async () => {
  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const test of errorTests) {
    const result = await runTest(test)
    if (result.passed) {
      passed++
      echo(`✅ ${test.name}`)
    } else {
      failed++
      failures.push(`❌ ${test.name}\n   ${result.error}`)
    }
  }

  echo('\n' + '='.repeat(60))
  echo(`Total: ${errorTests.length} | Passed: ${passed} | Failed: ${failed}`)
  echo('='.repeat(60))

  if (failures.length > 0) {
    echo('\nFailures:\n')
    for (const failure of failures) {
      echo(failure + '\n')
    }
    throw new Error(`${failed} error test(s) failed`)
  }

  echo('\n🎉 All error tests passed!')
  return errorTests.length
}

export default main
