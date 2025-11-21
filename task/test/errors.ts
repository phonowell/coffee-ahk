import { echo } from 'fire-keeper'
import start from '../../src/entry/index.js'

interface ErrorTest {
  name: string
  code: string
  expectedError: RegExp
}

const errorTests: ErrorTest[] = [
  // Forbidden formatter tests (CoffeeScript compiles these, but we reject them)
  {
    name: 'Optional chaining (?.) is forbidden',
    code: 'x = obj?.prop',
    expectedError: /ahk\/forbidden.*\?\..*not supported/i,
  },
  {
    name: 'Existential operator (bin?) is forbidden',
    code: 'if bin? then 1',
    expectedError: /ahk\/forbidden.*\?.*not supported/i, // CoffeeScript tokenizes as '?'
  },
  {
    name: 'Range operator (..) is forbidden',
    code: 'arr = [1..10]',
    expectedError: /ahk\/forbidden.*\.\..*not supported/i,
  },
  {
    name: 'Post-if syntax is forbidden',
    code: 'return 1 if condition',
    expectedError: /ahk\/forbidden.*post-if/i,
  },
  {
    name: 'Question mark operator (?) is forbidden',
    code: 'x = a ? b : c',
    expectedError: /ahk\/forbidden.*\?.*not supported/i,
  },

  // Operator forbidden tests (CoffeeScript rejects undeclared variable first)
  {
    name: 'Logical OR assignment (||=) requires declaration',
    code: 'x ||= 1',
    expectedError: /can't be assigned.*\|\|=.*not been declared/i,
  },
  {
    name: 'Existential assignment (?=) requires declaration',
    code: 'x ?= 1',
    expectedError: /can't be assigned.*\?=.*not been declared/i,
  },
  {
    name: 'Logical OR assignment (||=) is forbidden even when declared',
    code: 'x = 0\nx ||= 1',
    expectedError: /ahk\/forbidden.*\|\|=/i,
  },
  {
    name: 'Existential assignment (?=) is forbidden even when declared',
    code: 'x = 0\nx ?= 1',
    expectedError: /ahk\/forbidden.*\?=/i,
  },
  {
    name: 'Logical AND assignment (&&=) is forbidden',
    code: 'x = 1\nx &&= 2',
    expectedError: /ahk\/forbidden.*&&=/i,
  },
  {
    name: 'Floor division (//) is forbidden',
    code: 'x = 10 // 3',
    expectedError: /ahk\/forbidden.*\/\/.*comment/i,
  },
  {
    name: 'Floor division assignment (//=) is forbidden',
    code: 'x = 10\nx //= 3',
    expectedError: /ahk\/forbidden.*\/\/=.*comment/i,
  },
  {
    name: 'Modulo (%%) is forbidden',
    code: 'x = 10 %% 3',
    expectedError: /ahk\/forbidden.*%%.*not supported/i,
  },
  {
    name: 'Modulo assignment (%%=) is forbidden',
    code: 'x = 10\nx %%= 3',
    expectedError: /ahk\/forbidden.*%%=.*not supported/i,
  },

  // Bitwise operators forbidden
  {
    name: 'Bitwise AND (&) is forbidden',
    code: 'x = 5 & 3',
    expectedError: /ahk\/forbidden.*&.*not supported/i,
  },
  {
    name: 'Bitwise OR (|) is forbidden',
    code: 'x = 5 | 3',
    expectedError: /ahk\/forbidden.*\|.*not supported/i,
  },

  // Relation operators forbidden
  {
    name: 'in operator is forbidden',
    code: 'x = 1 in [1,2,3]',
    expectedError: /ahk\/forbidden.*relation.*not supported/i,
  },
  {
    name: 'instanceof operator is forbidden',
    code: 'x = obj instanceof Array',
    expectedError: /ahk\/forbidden.*relation.*not supported/i,
  },
  {
    name: 'typeof operator is forbidden',
    code: 'x = typeof obj',
    expectedError: /ahk\/forbidden.*typeof.*not supported/i,
  },
  {
    name: 'delete operator is forbidden',
    code: 'delete obj.key',
    expectedError: /ahk\/forbidden.*delete.*not supported/i,
  },

  // Number forbidden tests
  {
    name: 'BigInt literal is forbidden',
    code: 'n = 123n',
    expectedError: /ahk\/forbidden.*BigInt/i,
  },

  // Sign forbidden tests (spread in wrong context)
  {
    name: 'Spread operator in object literal is forbidden',
    code: 'obj = { ...other }',
    expectedError: /ahk\/forbidden.*spread operator/i,
  },

  // Variable name validation
  {
    name: 'Reserved class name is forbidden',
    code: 'class Class\n  a: 1',
    expectedError: /ahk\/forbidden.*class name.*reserved/i,
  },
  {
    name: 'Reserved variable name (CoffeeScript error)',
    code: 'return = 1',
    expectedError: /keyword.*can't be assigned|reserved/i,
  },
  {
    name: 'A_ prefix variable name is forbidden',
    code: 'A_Custom = 1',
    expectedError: /ahk\/forbidden.*a_.*prefix.*reserved/i,
  },
  {
    name: 'Reserved parameter name (CoffeeScript error)',
    code: 'fn = (return) -> 1',
    expectedError: /unexpected|reserved/i,
  },
  {
    name: 'Reserved name in destructuring (CoffeeScript error)',
    code: '[return, break] = [1, 2]',
    expectedError: /unexpected|reserved/i,
  },
]

const main = async () => {
  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const test of errorTests) {
    try {
      // Call the internal entry point directly to avoid error swallowing
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

      // If no error was thrown, the test failed
      failed++
      failures.push(
        `❌ ${test.name}\n   Expected error: ${test.expectedError}\n   But compilation succeeded\n   Result: ${result.content.substring(0, 100)}`,
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      if (test.expectedError.test(errorMessage)) {
        passed++
        echo(`✅ ${test.name}`)
      } else {
        failed++
        failures.push(
          `❌ ${test.name}\n   Expected: ${test.expectedError}\n   Got: ${errorMessage.substring(0, 200)}`,
        )
      }
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
