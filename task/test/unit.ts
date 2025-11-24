import { echo } from 'fire-keeper'
import Item from '../../src/models/Item.js'
import Content from '../../src/models/Content.js'
import Scope from '../../src/models/Scope.js'
import type { ScopeType } from '../../src/models/ScopeType.js'

interface UnitTest {
  name: string
  test: () => void | Promise<void>
}

const tests: UnitTest[] = [
  // Item tests
  {
    name: 'Item: create with basic properties',
    test: () => {
      const item = new Item('identifier', 'foo', new Scope())
      if (item.type !== 'identifier') throw new Error('Item type mismatch')
      if (item.value !== 'foo') throw new Error('Item value mismatch')
    },
  },
  {
    name: 'Item: clone creates independent copy',
    test: () => {
      const original = new Item('identifier', 'original', new Scope())
      const cloned = original.clone()

      if (original === cloned) throw new Error('Clone is same reference')
      if (original.value !== cloned.value) throw new Error('Clone value mismatch')

      // Modify clone
      cloned.value = 'modified'
      if (original.value === 'modified') throw new Error('Clone mutation affected original')
    },
  },
  {
    name: 'Item: is() method checks type and value',
    test: () => {
      const item = new Item('identifier', 'foo', new Scope())

      if (!item.is('identifier')) throw new Error('is() type check failed')
      if (!item.is('identifier', 'foo')) throw new Error('is() type+value check failed')
      if (item.is('identifier', 'bar')) throw new Error('is() should return false for wrong value')
      if (item.is('function')) throw new Error('is() should return false for wrong type')
    },
  },
  {
    name: 'Item: comment property is optional',
    test: () => {
      const item = new Item('identifier', 'foo', new Scope())
      if (item.comment !== undefined) throw new Error('Comment should be undefined by default')

      item.comment = ['// test comment']
      if (item.comment?.[0] !== '// test comment') throw new Error('Comment not set correctly')
    },
  },

  // Content tests
  {
    name: 'Content: starts empty',
    test: () => {
      const content = new Content(new Scope())
      if (content.list.length !== 0) throw new Error('Content should start empty')
    },
  },
  {
    name: 'Content: push() adds items',
    test: () => {
      const content = new Content(new Scope())
      content.push('identifier', 'foo')
      content.push('identifier', 'bar')

      if (content.list.length !== 2) throw new Error('Content should have 2 items')
      if (content.at(0)?.value !== 'foo') throw new Error('First item value mismatch')
      if (content.at(1)?.value !== 'bar') throw new Error('Second item value mismatch')
    },
  },
  {
    name: 'Content: last returns last item',
    test: () => {
      const content = new Content(new Scope())
      content.push('identifier', 'first')
      content.push('identifier', 'last')

      if (content.last.value !== 'last') throw new Error('last should return last item')
    },
  },
  {
    name: 'Content: at() returns item by index',
    test: () => {
      const content = new Content(new Scope())
      content.push('identifier', 'foo')
      content.push('identifier', 'bar')

      if (content.at(0)?.value !== 'foo') throw new Error('at(0) failed')
      if (content.at(1)?.value !== 'bar') throw new Error('at(1) failed')
      if (content.at(2) !== undefined) throw new Error('at(2) should return undefined')
      if (content.at(-1)?.value !== 'bar') throw new Error('at(-1) should return last')
    },
  },
  {
    name: 'Content: reload() replaces all items',
    test: () => {
      const content = new Content(new Scope())
      content.push('identifier', 'old')

      const newItems = [
        new Item('identifier', 'new1', new Scope()),
        new Item('identifier', 'new2', new Scope()),
      ]
      content.reload(newItems)

      if (content.list.length !== 2) throw new Error('Reload should replace items')
      if (content.at(0)?.value !== 'new1') throw new Error('Reload item 1 mismatch')
      if (content.at(1)?.value !== 'new2') throw new Error('Reload item 2 mismatch')
    },
  },

  // Scope tests
  {
    name: 'Scope: starts empty',
    test: () => {
      const scope = new Scope()
      if (scope.length !== 0) throw new Error('Scope should start empty')
      if (scope.last !== '') throw new Error('Empty scope last should be empty string')
    },
  },
  {
    name: 'Scope: can be initialized with data',
    test: () => {
      const scope = new Scope(['function', 'class'])
      if (scope.length !== 2) throw new Error('Scope should have 2 levels')
      if (scope.first !== 'function') throw new Error('First should be function')
      if (scope.last !== 'class') throw new Error('Last should be class')
    },
  },
  {
    name: 'Scope: push() adds scope level',
    test: () => {
      const scope = new Scope(['if'])
      scope.push('class')
      scope.push('function')

      if (scope.length !== 3) throw new Error('Scope should have 3 levels')
      if (scope.at(1) !== 'class') throw new Error('Second level should be class')
      if (scope.at(2) !== 'function') throw new Error('Third level should be function')
    },
  },
  {
    name: 'Scope: pop() removes last level',
    test: () => {
      const scope = new Scope(['if', 'class', 'function'])
      const popped = scope.pop()

      if (popped !== 'function') throw new Error('Pop should return removed value')
      if (scope.length !== 2) throw new Error('Pop should remove one level')
      if (scope.last !== 'class') throw new Error('Last should be class after pop')
    },
  },
  {
    name: 'Scope: last returns last scope level',
    test: () => {
      const scope = new Scope(['if'])
      const initialLast = scope.last
      if (initialLast !== 'if') throw new Error('Last should be if initially')

      scope.push('class')
      const afterPushLast = scope.last
      if (afterPushLast !== 'class') throw new Error('Last should be class after push')
    },
  },
  {
    name: 'Scope: at() returns scope level by index',
    test: () => {
      const scope = new Scope(['if', 'class', 'function'])

      if (scope.at(0) !== 'if') throw new Error('at(0) should be if')
      if (scope.at(1) !== 'class') throw new Error('at(1) should be class')
      if (scope.at(-1) !== 'function') throw new Error('at(-1) should be last')
      if (scope.at(10) !== undefined) throw new Error('at(10) should be undefined')
    },
  },
  {
    name: 'Scope: reload() replaces scope data',
    test: () => {
      const scope = new Scope(['if', 'class'])
      scope.reload(['if', 'function', 'for'])

      if (scope.length !== 3) throw new Error('Reload should replace data')
      if (scope.at(1) !== 'function') throw new Error('Reload data mismatch')
    },
  },
  {
    name: 'Scope: list property returns copy',
    test: () => {
      const scope = new Scope(['if', 'class'])
      const list1 = scope.list
      const list2 = scope.list

      if (list1 === list2) throw new Error('list should return new copy each time')
      if (list1.length !== 2) throw new Error('list length mismatch')
    },
  },
  {
    name: 'Scope: isEqual() compares scopes',
    test: () => {
      const scope1 = new Scope(['if', 'class'])
      const scope2 = new Scope(['if', 'class'])
      const scope3 = new Scope(['if', 'function'])

      if (!scope1.isEqual(scope2)) throw new Error('Equal scopes should match')
      if (!scope1.isEqual(['if', 'class'])) throw new Error('Should match array')
      if (scope1.isEqual(scope3)) throw new Error('Different scopes should not match')
    },
  },

  // Integration tests
  {
    name: 'Integration: Content with Scope updates',
    test: () => {
      const scope = new Scope(['if'])
      const content = new Content(scope)

      scope.push('class')
      content.push('identifier', 'foo')

      if (content.last.scope.last !== 'class') {
        throw new Error('Item should capture current scope')
      }

      scope.push('function')
      content.push('identifier', 'bar')

      if (content.at(0)?.scope.last !== 'class') {
        throw new Error('First item scope should still be class')
      }
      if (content.at(1)?.scope.last !== 'function') {
        throw new Error('Second item scope should be function')
      }
    },
  },
  {
    name: 'Scope: reload() creates independent copy of array',
    test: () => {
      const arr: ScopeType[] = ['if', 'class']
      const scope = new Scope()
      scope.reload(arr)

      // Modifying original array should NOT affect scope
      arr.push('function')

      if (scope.length !== 2) {
        throw new Error('Scope should not be affected by external array modification')
      }
      if (scope.at(2) !== undefined) {
        throw new Error('Scope should remain independent')
      }
    },
  },
  {
    name: 'Integration: Scope copies are independent',
    test: () => {
      const scope1 = new Scope(['if'])
      const scope2 = new Scope(scope1.list) // Create from list copy

      scope1.push('class')
      scope2.push('function')

      // After modifications, they should be different
      if (scope1.length !== 2 || scope2.length !== 2) {
        throw new Error('Both should have added one level')
      }
      if (scope1.last === scope2.last) {
        throw new Error('Different scopes should have different last values')
      }
      if (scope1.last !== 'class') throw new Error('scope1 should end with class')
      if (scope2.last !== 'function') throw new Error('scope2 should end with function')
    },
  },
]

const main = async () => {
  let passed = 0
  let failed = 0
  const failures: string[] = []

  echo('\n' + '='.repeat(60))
  echo('UNIT TESTS - Core Models')
  echo('='.repeat(60))

  for (const test of tests) {
    try {
      await test.test()
      passed++
      echo(`✅ ${test.name}`)
    } catch (error) {
      failed++
      const errorMessage = error instanceof Error ? error.message : String(error)
      failures.push(`${test.name}: ${errorMessage}`)
      echo(`❌ ${test.name}`)
    }
  }

  echo('\n' + '='.repeat(60))
  echo(`Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}`)
  echo('='.repeat(60))

  if (failures.length > 0) {
    echo('\nFailures:\n')
    for (const failure of failures) {
      echo(`  ${failure}`)
    }
    throw new Error(`${failed} unit test(s) failed`)
  }

  echo('\n🎉 All unit tests passed!')

  return tests.length
}

export default main
