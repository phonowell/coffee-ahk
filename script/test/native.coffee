# Native AHK code injection
# Test strategy: top-level vs function, simple vs closure

# === Top-level (no ctx transform) ===

# Top-level Native - variables NOT transformed (顶层不转换)
`StringUpper, result, input`
Native 'StringLower, result, input'

# === Function context (ctx transform) ===

# Simple function - direct variable reference
fn1 = ->
  `StringUpper, $result, ipt`

# Expression mode with %
fn2 = ->
  Native 'msgbox, % msg'

# Traditional %name% syntax
fn3 = ->
  Native 'return %myVar%'

# Multiple variables in one Native
fn4 = ->
  `Format, output, {1} + {2} = {3}, a, b, c`

# === Closure context ===

# Closure - inner function uses outer variable
fn5 = ->
  prefix = 'hello'
  inner = ->
    `StringUpper, prefix, prefix`
  inner()

# === Variables that should NOT be transformed ===

# Global variables (ctx.cache.global)
globalVar = 'test'
fn6 = ->
  `msgbox, % globalVar`

# this reference
fn7 = ->
  `msgbox, % this.name`

# Uppercase identifiers (class names)
fn8 = ->
  `msgbox, % MyClass.value`

# AHK keywords from forbidden.json
fn9 = ->
  `
  if (x) {
    return y
  }
  `

# Property access (after dot)
fn10 = ->
  `msgbox, % obj.prop`

# Function calls (followed by parenthesis)
fn11 = ->
  `result := GetValue()`

# Internal variables (ℓ prefix)
fn12 = ->
  `msgbox, % ℓidx`

# Multi-line with mixed variables
fn13 = ->
  localVar = 1
  `
  StringUpper, localVar, localVar
  msgbox, % localVar
  `
