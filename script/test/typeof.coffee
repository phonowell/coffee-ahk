# Basic typeof
x = typeof y
z = typeof 123

# Property access
a = typeof obj.prop

# Index access
b = typeof arr[0]

# Function call
c = typeof fn()

# Comparison
d = typeof x == "number"

# Logical expression
e = typeof x == "string" or typeof x == "number"

# Chained property
f = typeof obj.a.b.c

# Nested calls
g = typeof fn().prop

# String literal
h = typeof "hello"

# In function parameter
fn2(typeof x)

# With bitwise NOT (edge case)
i = typeof ~x

# In array
arr2 = [typeof x, typeof y]

# In object value
obj2 = {t: typeof x}

# Chained method call
j = typeof obj.method().result

# === Function context tests ===

# typeof in function
fn1 = ->
  num = 123
  return typeof num

# typeof with closure variable
fn2 = ->
  data = 'hello'
  checker = ->
    return typeof data
  return checker()

# typeof in condition with closure
fn3 = ->
  value = 42
  checkNumber = ->
    return typeof value == 'number'
  return checkNumber()

# typeof with modified closure var
fn4 = ->
  val = 1
  modifier = ->
    val = 'changed'
  modifier()
  return typeof val

# typeof in array with closure
fn5 = ->
  num = 1
  str = 'str'
  builder = ->
    return [typeof num, typeof str]
  return builder()

# typeof with object property in closure
fn6 = ->
  obj = {val: 123}
  checker = ->
    return typeof obj.val
  return checker()
