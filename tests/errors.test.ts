import { describe, expect, test } from 'vitest'

import start from '../src/entry/index.js'

const compile = (code: string) =>
  start(code, {
    metadata: false,
    salt: 'ahk',
    comments: false,
    ast: false,
    coffeeAst: false,
    save: false,
    string: false,
    verbose: false,
  })

const errorTests: [name: string, code: string, expectedError: RegExp][] = [
  [
    'Optional chaining (?.) is forbidden',
    'x = obj?.prop',
    /Coffee-AHK\/forbidden.*\?\..*not supported/i,
  ],
  [
    'Range operator (..) is forbidden',
    'arr = [1..10]',
    /Coffee-AHK\/forbidden.*\.\..*not supported/i,
  ],
  ['Post-if syntax is forbidden', 'return 1 if condition', /Coffee-AHK\/forbidden.*post-if/i],
  ['Logical OR assignment (||=) is forbidden', 'x = 0\nx ||= 1', /Coffee-AHK\/forbidden.*\|\|=/i],
  ['Floor division (//) is forbidden', 'x = 10 // 3', /Coffee-AHK\/forbidden.*\/\/.*comment/i],
  ['in operator is forbidden', 'x = 1 in [1,2,3]', /Coffee-AHK\/forbidden.*in.*not supported/i],
  [
    'delete operator is forbidden',
    'delete obj.key',
    /Coffee-AHK\/forbidden.*delete.*not supported/i,
  ],
  ['BigInt literal is forbidden', 'n = 123n', /Coffee-AHK\/unsupported.*BigInt/i],
  [
    'Spread operator in object literal is forbidden',
    'obj = { ...other }',
    /Coffee-AHK\/forbidden.*spread operator/i,
  ],
  [
    'AHK built-in function as class name is forbidden',
    'class InStr\n  value: 1',
    /Coffee-AHK\/forbidden.*class name.*forbidden/i,
  ],
  [
    'A_ prefix in assignment is forbidden',
    'A_Index = 5',
    /Coffee-AHK\/forbidden.*A_Index.*a_.*prefix/i,
  ],
  [
    'AHK built-in function as parameter is forbidden',
    'fn = (InStr) -> InStr(a, b)',
    /Coffee-AHK\/forbidden.*parameter.*InStr/i,
  ],
  [
    'A_ prefix in array destructuring is forbidden',
    '[A_Index, x] = arr',
    /Coffee-AHK\/forbidden.*array destructuring target.*A_Index.*a_.*prefix/i,
  ],
  [
    'A_ prefix as catch variable is forbidden',
    'try\n  x = 1\ncatch A_Index\n  console.log(A_Index)',
    /Coffee-AHK\/forbidden.*catch variable.*A_Index/i,
  ],
  [
    'await is not supported',
    "fn = -> await fetch('url')",
    /Coffee-AHK\/unsupported.*await.*not supported/i,
  ],
  [
    'for loop destructuring is not supported',
    'for [a, b] in arr\n  a + b',
    /Coffee-AHK\/unsupported.*for loop destructuring/i,
  ],
  [
    'nested array destructuring is not supported',
    '[a, [b, c]] = [1, [2, 3]]',
    /Coffee-AHK\/unsupported.*nested array destructuring/i,
  ],
  [
    'Single-letter class name is forbidden',
    'class A\n  a: 1',
    /Coffee-AHK\/class-error.*class name.*A.*single letter/i,
  ],
  [
    '@property in constructor parameters is forbidden',
    'class Animal\n  constructor: (@name) ->',
    /Coffee-AHK\/syntax-error.*this\.name.*constructor parameters/i,
  ],
]

describe('error scenarios', () => {
  test.each(errorTests)('%s', async (_name, code, expectedError) => {
    await expect(compile(code)).rejects.toThrow(expectedError)
  })
})
