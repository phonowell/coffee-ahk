# Collection (array/object) index access patterns

# === READ ACCESS ===

# Numeric index (0-based → 1-based conversion)
a[0]
a[1]
a[10]

# String key (no conversion needed)
a['a']
a["key"]

# Variable index (uses __ci__ helper for 0→1 conversion)
a[a]
a[idx]

# Float index
a[1.1]

# Expression index
a[3 + 2]
a[a - 1]
a[1 - a]

# This-property index
a[@b]
a[@b - 1]
a[1 - @b]

# Interpolated string key
a["string#{b}"]

# Function call result as index
a[fn()]
a[@fn()]

# Chained index
a[b[c]]
a[b[c[d]]]

# === WRITE ACCESS (Assignment) ===

# Numeric index assignment
arr[0] = 1
arr[1] = 2

# Variable index assignment (uses __ci__ helper)
arr[i] = value
arr[idx] = 999

# Expression index assignment
arr[i + 1] = x
arr[len - 1] = y

# Property chain assignment
obj.items[0] = first
obj.items[i] = value

# Note: Negative index assignment is in negative-index.coffee

# === Function context tests ===

# Index access in function
fn1 = ->
  arr = [10, 20, 30]
  return arr[1]

# Index with closure variable
fn2 = ->
  arr = [1, 2, 3, 4, 5]
  idx = 2
  getter = ->
    return arr[idx]
  return getter()

# Index write in closure
fn3 = ->
  arr = [1, 2, 3]
  setter = (i, v) ->
    arr[i] = v
  setter 0, 99
  return arr

# Computed index in closure
fn4 = ->
  arr = [10, 20, 30, 40]
  offset = 1
  getAt = (base) ->
    return arr[base + offset]
  return getAt 1

# Chained index in function
fn5 = ->
  matrix = [[1, 2], [3, 4]]
  inner = ->
    return matrix[0][1]
  return inner()

# String key access in function
fn6 = ->
  obj = {a: 1, b: 2}
  key = 'a'
  getter = ->
    return obj[key]
  return getter()

# Index with this-property
fn7 = ->
  data = [100, 200, 300]
  idx = 1
  reader = ->
    return data[idx]
  return reader()
