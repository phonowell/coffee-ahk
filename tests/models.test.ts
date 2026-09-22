import { describe, expect, test } from 'vitest'

import Content from '../src/models/Content.js'
import Item from '../src/models/Item.js'
import Scope from '../src/models/Scope.js'

import type { ScopeType } from '../src/models/ScopeType.js'

describe('Item', () => {
  test('create with basic properties', () => {
    const item = new Item({ type: 'identifier', value: 'foo', scope: new Scope() })
    expect(item.type).toBe('identifier')
    expect(item.value).toBe('foo')
  })

  test('clone creates independent copy', () => {
    const original = new Item({ type: 'identifier', value: 'original', scope: new Scope() })
    const cloned = original.clone()

    expect(cloned).not.toBe(original)
    expect(cloned.value).toBe(original.value)

    cloned.value = 'modified'
    expect(original.value).toBe('original')
  })

  test('is() checks type and value', () => {
    const item = new Item({ type: 'identifier', value: 'foo', scope: new Scope() })

    expect(item.is('identifier')).toBe(true)
    expect(item.is('identifier', 'foo')).toBe(true)
    expect(item.is('identifier', 'bar')).toBe(false)
    expect(item.is('function')).toBe(false)
  })

  test('comment property is optional', () => {
    const item = new Item({ type: 'identifier', value: 'foo', scope: new Scope() })
    expect(item.comment).toBeUndefined()

    item.comment = ['// test comment']
    expect(item.comment?.[0]).toBe('// test comment')
  })
})

describe('Content', () => {
  test('starts empty', () => {
    expect(new Content(new Scope()).toArray()).toHaveLength(0)
  })

  test('push() adds items', () => {
    const content = new Content(new Scope())
    content.push({ type: 'identifier', value: 'foo' })
    content.push({ type: 'identifier', value: 'bar' })

    expect(content.toArray()).toHaveLength(2)
    expect(content.at(0)?.value).toBe('foo')
    expect(content.at(1)?.value).toBe('bar')
  })

  test('at() returns item by index', () => {
    const content = new Content(new Scope())
    content.push({ type: 'identifier', value: 'foo' })
    content.push({ type: 'identifier', value: 'bar' })

    expect(content.at(0)?.value).toBe('foo')
    expect(content.at(1)?.value).toBe('bar')
    expect(content.at(2)).toBeUndefined()
    expect(content.at(-1)?.value).toBe('bar')
  })

  test('reload() replaces all items', () => {
    const content = new Content(new Scope())
    content.push({ type: 'identifier', value: 'old' })

    content.reload([
      new Item({ type: 'identifier', value: 'new1', scope: new Scope() }),
      new Item({ type: 'identifier', value: 'new2', scope: new Scope() }),
    ])

    expect(content.toArray()).toHaveLength(2)
    expect(content.at(0)?.value).toBe('new1')
    expect(content.at(1)?.value).toBe('new2')
  })
})

describe('Scope', () => {
  test('starts empty', () => {
    const scope = new Scope()
    expect(scope.length).toBe(0)
    expect(scope.last).toBe('')
  })

  test('can be initialized with data', () => {
    const scope = new Scope(['function', 'class'])
    expect(scope.length).toBe(2)
    expect(scope.first).toBe('function')
    expect(scope.last).toBe('class')
  })

  test('push() adds scope level', () => {
    const scope = new Scope(['if'])
    scope.push('class')
    scope.push('function')

    expect(scope.length).toBe(3)
    expect(scope.at(1)).toBe('class')
    expect(scope.at(2)).toBe('function')
  })

  test('pop() removes last level', () => {
    const scope = new Scope(['if', 'class', 'function'])

    expect(scope.pop()).toBe('function')
    expect(scope.length).toBe(2)
    expect(scope.last).toBe('class')
  })

  test('last returns last scope level', () => {
    const scope = new Scope(['if'])
    expect(scope.last).toBe('if')

    scope.push('class')
    expect(scope.last).toBe('class')
  })

  test('at() returns scope level by index', () => {
    const scope = new Scope(['if', 'class', 'function'])

    expect(scope.at(0)).toBe('if')
    expect(scope.at(1)).toBe('class')
    expect(scope.at(-1)).toBe('function')
    expect(scope.at(10)).toBeUndefined()
  })

  test('reload() replaces scope data', () => {
    const scope = new Scope(['if', 'class'])
    scope.reload(['if', 'function', 'for'])

    expect(scope.length).toBe(3)
    expect(scope.at(1)).toBe('function')
  })

  test('reload() creates independent copy of array', () => {
    const arr: ScopeType[] = ['if', 'class']
    const scope = new Scope()
    scope.reload(arr)

    arr.push('function')

    expect(scope.length).toBe(2)
    expect(scope.at(2)).toBeUndefined()
  })

  test('toArray() returns copy', () => {
    const scope = new Scope(['if', 'class'])
    const list1 = scope.toArray()
    const list2 = scope.toArray()

    expect(list1).not.toBe(list2)
    expect(list1).toHaveLength(2)
  })

  test('isEqual() compares scopes', () => {
    const scope1 = new Scope(['if', 'class'])
    const scope2 = new Scope(['if', 'class'])
    const scope3 = new Scope(['if', 'function'])

    expect(scope1.isEqual(scope2)).toBe(true)
    expect(scope1.isEqual(['if', 'class'])).toBe(true)
    expect(scope1.isEqual(scope3)).toBe(false)
  })

  test('scope copies are independent', () => {
    const scope1 = new Scope(['if'])
    const scope2 = new Scope(scope1.toArray())

    scope1.push('class')
    scope2.push('function')

    expect(scope1.last).toBe('class')
    expect(scope2.last).toBe('function')
  })

  test('Content captures current scope per item', () => {
    const scope = new Scope(['if'])
    const content = new Content(scope)

    scope.push('class')
    content.push({ type: 'identifier', value: 'foo' })

    expect(content.at(-1)?.scope.last).toBe('class')

    scope.push('function')
    content.push({ type: 'identifier', value: 'bar' })

    expect(content.at(0)?.scope.last).toBe('class')
    expect(content.at(1)?.scope.last).toBe('function')
  })
})
