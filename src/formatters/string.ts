import type { Context } from '../types/index.js'

const main = (ctx: Context): boolean => {
  const { content, token, type, value } = ctx

  if (type === 'string') {
    content.push({
      type: 'string',
      value: transAlias(value, token[1].quote ?? '"'),
    })
    return true
  }

  // "xxx#{xxx}xxx"

  if (type === 'interpolation_start') {
    content.push({ type: 'edge', value: 'interpolation-start' })
    return true
  }

  if (type === 'interpolation_end') {
    content.push({ type: 'edge', value: 'interpolation-end' })
    return true
  }

  // Interpolated-string boundary markers: consume so the token isn't
  // reported as unhandled; inner parts produce the actual output
  if (type === 'string_start' || type === 'string_end') return true

  return false
}

/** AHK escapes for JS control-character escapes */
const ESCAPE_MAP: Record<string, string> = {
  n: '`n',
  r: '`r',
  t: '`t',
  b: '`b',
  a: '`a',
  v: '`v',
  f: '`f',
}

/**
 * Translate a CoffeeScript string literal to an AHK double-quoted literal.
 * Single-quoted CoffeeScript strings are literal except \\ and \' ;
 * double-quoted strings (and heredoc parts) process the full escape set.
 */
const transAlias = (input: string, wrapper: string): string => {
  const raw = input.substring(1, input.length - 1)
  const literal = wrapper.startsWith("'")

  const out: string[] = []
  const emit = (ch: string) => {
    if (ch === '"') out.push('""')
    else if (ch === '%') out.push('`%')
    else if (ch.charCodeAt(0) < 0x20) out.push(`" . Chr(${ch.charCodeAt(0)}) . "`)
    else out.push(ch)
  }

  let i = 0
  while (i < raw.length) {
    const ch = raw.at(i) ?? ''
    // Real newlines pass through raw — the heredoc/multiline collapse below owns them
    if (ch === '\n') {
      out.push('\n')
      i++
      continue
    }
    if (ch !== '\\') {
      emit(ch)
      i++
      continue
    }

    const next = raw.at(i + 1)
    if (next === undefined) {
      out.push('\\')
      i++
      continue
    }

    // Escapes shared by single- and double-quoted strings
    if (next === '\\') {
      out.push('\\')
      i += 2
      continue
    }
    if (next === "'") {
      out.push("'")
      i += 2
      continue
    }

    if (literal) {
      // Single-quoted: backslash stays literal
      out.push('\\')
      i++
      continue
    }

    // `\<newline>` is a line continuation — both chars disappear entirely
    if (next === '\n') {
      i += 2
      continue
    }

    const mapped = ESCAPE_MAP[next ?? '']
    if (mapped !== undefined) {
      out.push(mapped)
      i += 2
      continue
    }
    if (next === '"') {
      out.push('""')
      i += 2
      continue
    }
    if (next === '0') {
      emit('\x00')
      i += 2
      continue
    }
    if (next === 'x' || next === 'u') {
      const hexMatch =
        next === 'x'
          ? /^[0-9a-fA-F]{2}/.exec(raw.slice(i + 2))
          : raw.at(i + 2) === '{'
            ? /^[0-9a-fA-F]+/.exec(raw.slice(i + 3))
            : /^[0-9a-fA-F]{4}/.exec(raw.slice(i + 2))
      if (hexMatch) {
        const isBrace = next === 'u' && raw.at(i + 2) === '{'
        const code = parseInt(hexMatch[0], 16)
        // fromCodePoint throws RangeError beyond U+10FFFF — fall back to literal
        if (code <= 0x10ffff) {
          emit(String.fromCodePoint(code))
          i += 2 + hexMatch[0].length + (isBrace ? 2 : 0)
          continue
        }
      }
    }
    // Unknown escape: JS drops the backslash
    emit(next)
    i += 2
  }

  const result = `"${out.join('')}"`
  // Heredoc ('''/""") preserves newlines in CoffeeScript — emit `n escapes.
  // The boundary newline right after the opener / before the closer is dropped,
  // and every line loses the common leading indent (smallest across non-empty).
  if (wrapper.length === 3) {
    const body = result.replace(/^"\n/, '"').replace(/\n"$/, '"').slice(1, -1)
    const lines = body.split('\n')
    const indents = lines.filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)?.at(0)?.length ?? 0)
    const min = indents.length ? Math.min(...indents) : 0
    const dedented = lines
      .map((l) => l.slice(Math.min(min, /^[ \t]*/.exec(l)?.at(0)?.length ?? 0)))
      .join('`n')
    return `"${dedented}"`
  }
  // Multiline single/double-quoted strings collapse newlines to a space
  return result.replace(/\s*\n\s*/g, ' ')
}

export default main
