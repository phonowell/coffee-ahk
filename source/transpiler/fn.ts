import _ from 'lodash'

// interface
import { Block } from '../type'

// function

export function encodeFnName(
  name: string
): string {

  name = name
    .replace(/\]/g, '')
    .replace(/\[/g, '.')
    .replace(/\./g, '_dot_')

  return `__${name}__`
}

export function formatKey(
  input: string
): string {

  return input
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\-/g, '')
    // ---
    .replace(/equal/g, '=')
    .replace(/minus/g, '-')
    .replace(/num/g, 'numpad')
    .replace(/padpad/g, 'pad')
    .replace(/pagedown/g, 'pgdn')
    .replace(/pageup/g, 'pgup')
    .replace(/plus/g, '+')
    // ---
    .replace(/:/g, ' ')
}

export function getDepth(
  line: string
): number {
  return Math.floor((line.length - line.trimStart().length) / 2)
}

export function initBlock(): Block {
  return {
    name: '',
    argument: [],
    content: []
  }
}

export function regFn(
  listFn: Block[],
  name: string,
  argument: string[],
  content: string[]
): string {

  name = encodeFnName(name)
  content.push('')

  if (~_.findIndex(listFn, { name })) return name

  listFn.push({
    name,
    argument,
    content
  })

  return name
}

export function setDepth(
  n: number
): string {
  return _.repeat(' ', n * 2)
}

export function trim(
  input: string
): string {

  if (!["'", '"'].includes(input[0])) return input
  return input.slice(1, (input.length - 1))
}

export function unquote(
  line: string
): string {

  if (!line.includes('#{')) return line

  return line
    .replace(/#{/g, '" . ')
    .replace(/}/g, ' . "')
    .replace(/\.\s*""\s*\./g, '.')
    .replace(/"\s*\.\s*\.\s*"/g, '')
}