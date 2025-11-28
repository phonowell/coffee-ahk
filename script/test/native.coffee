# Native AHK code injection
# Test strategy: top-level vs function, simple vs closure, consecutive blocks

# === Top-level (no ctx transform) ===

# Top-level Native - variables NOT transformed
`StringUpper, result, input`
Native 'StringLower, result, input'

# === Function context (ctx transform with λ_var bridging) ===

# Simple function - direct variable reference
fn1 = ->
  str = 'hello'
  Native 'StringUpper, str, str'
  return str

# Expression mode with %
fn2 = ->
  msg = 'world'
  Native 'msgbox, % msg'

# Traditional %name% syntax
fn3 = ->
  myVar = 'test'
  Native 'return %myVar%'

# Multiple variables in one Native
fn4 = ->
  a = 1
  b = 2
  c = 3
  `Format, output, {1} + {2} = {3}, a, b, c`

# === Consecutive Native blocks (merged handling) ===

# Multiple consecutive Native lines
fn5 = (arr, idx) ->
  Native 'if idx is Number'
  Native '{'
  Native '  if (idx < 0) {'
  Native '    return arr.Length() + idx + 1'
  Native '  }'
  Native '  return idx + 1'
  Native '}'
  return idx

# === Closure context ===

# Closure - inner function uses outer variable
fn6 = ->
  prefix = 'hello'
  inner = ->
    Native 'StringUpper, prefix, prefix'
  inner()
  return prefix

# === Variables that should NOT be transformed ===

# Global variables (ctx.cache.global)
globalVar = 'test'
fn7 = ->
  Native 'msgbox, % globalVar'

# Uppercase identifiers (class names, AHK commands)
fn8 = ->
  Native 'MsgBox, Hello'
  Native 'StringUpper, A, B'

# AHK keywords from forbidden.json
fn9 = ->
  Native 'if (x) { return y }'

# Property access (after dot) - should not transform prop
fn10 = ->
  obj = { prop: 1 }
  Native 'msgbox, % obj.prop'

# Function calls (followed by parenthesis)
fn11 = ->
  Native 'result := GetValue()'

# Internal variables (ℓ prefix)
fn12 = ->
  Native 'msgbox, % ℓidx'
