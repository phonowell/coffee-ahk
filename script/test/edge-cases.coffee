# Edge cases - special characters, boundary conditions

# 1. Variable names with special prefixes
fn1 = ->
  dollar = 1
  _underscore = 2
  result = dollar + _underscore
  return result

# 2. Variable names that look like internal vars
fn2 = ->
  result = 1  # not ℓresult
  idx = 0     # not ℓidx
  return result + idx

# 3. Empty function body
fn3 = ->

# 4. Function with only return
fn4 = ->
  return

# 5. Function with explicit undefined
fn5 = ->
  x = undefined
  return x

# 6. Deeply nested scopes
fn6 = ->
  a = 1
  if true
    b = 2
    if true
      c = 3
      if true
        d = 4
        inner = -> a + b + c + d
        return inner()

# 7. Variable shadowing
fn7 = ->
  x = 'outer'
  inner = ->
    x = 'inner'  # modifies outer x, not shadow
    return x
  inner()
  return x

# 8. Multiple assignment targets
fn8 = ->
  a = b = c = 1
  inner = ->
    a = b = c = 2
  inner()
  return a + b + c

# 9. Compound assignment in closure
fn9 = ->
  x = 10
  inner = ->
    x += 5
    x -= 2
    x *= 2
  inner()
  return x

# 10. Array element modification in closure
fn10 = ->
  arr = [1, 2, 3]
  inner = ->
    arr[0] = 10
    arr[1] = 20
  inner()
  return arr

# 11. Object property modification in closure
fn11 = ->
  obj = {a: 1, b: 2}
  inner = ->
    obj.a = 10
    obj.b = 20
  inner()
  return obj

# 12. Chained property access in closure
fn12 = ->
  data = {nested: {value: 1}}
  inner = ->
    data.nested.value = 99
  inner()
  return data.nested.value

# 13. Negative index in closure
fn13 = ->
  arr = [1, 2, 3]
  inner = ->
    return arr[-1]
  return inner()

# 14. String interpolation with closure vars
fn14 = ->
  name = 'world'
  greet = ->
    name = 'closure'
    return "hello #{name}"
  return greet()

# 15. Callback with multiple closures
fn15 = ->
  results = []
  for i in [1, 2, 3]
    for j in [4, 5]
      results.push -> [i, j]
  return results

# 16. Immediate function execution modifying outer
fn16 = ->
  x = 1
  (-> x = 2)()
  return x

# 17. Arrow in object literal accessing outer
fn17 = ->
  outer = 'test'
  obj = {
    method: ->
      return outer
  }
  return obj.method()
