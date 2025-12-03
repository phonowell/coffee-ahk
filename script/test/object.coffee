a = a: 1
a = a: 1, b: 2
a =
  a: 1
a =
  a: 1
  b: 2
a =
  a: 1
  b: 2
  c:
    a: 1, b: 2, c: 3

fn = ->
  a =
    a: 1
    b:
      a: 1
      b: 2
  return d = 1

{a, b, c} =
  a: 1
  b: 2
  c: 3

# === Function context tests ===

# Object in function
fn1 = ->
  obj = {a: 1, b: 2}
  return obj

# Object modification in closure
fn2 = ->
  obj = {x: 1, y: 2}
  modifier = ->
    obj.x = 10
    obj.y = 20
  modifier()
  return obj

# Object property access in closure
fn3 = ->
  data = {value: 42}
  getter = ->
    return data.value
  return getter()

# Nested object with closure
fn4 = ->
  config = {
    inner: {
      setting: 'default'
    }
  }
  updater = ->
    config.inner.setting = 'updated'
  updater()
  return config.inner.setting

# Object destructure with closure
fn5 = ->
  {p, q} = {p: 1, q: 2}
  modifier = ->
    p = 10
    q = 20
  modifier()
  return p + q

# Object with function property
fn6 = ->
  counter = 0
  obj = {
    increment: ->
      counter += 1
    get: ->
      return counter
  }
  obj.increment()
  obj.increment()
  return obj.get()

# Object literal with closure vars
fn7 = ->
  x = 'hello'
  y = 'world'
  builder = ->
    return {first: x, second: y}
  return builder()

# Dynamic object key with closure
fn8 = ->
  key = 'dynamic'
  value = 123
  builder = ->
    obj = {}
    obj[key] = value
    return obj
  return builder()