# Closure tests - ctx transform scenarios

# 1. Basic: inner function modifies outer variable
outer1 = ->
  x = 1
  inner = -> x = 2
  inner()
  return x  # should be 2

# 2. Nested: multi-level closure variable sharing
outer2 = ->
  a = 1
  level1 = ->
    b = 2
    level2 = ->
      a = 10  # modify outer's outer variable
      b = 20  # modify outer variable
    level2()
    return a + b
  return level1()

# 3. Loop + closure: classic closure trap
outer3 = ->
  fns = []
  for i in [1, 2, 3]
    fns.push -> i  # each fn captures same i
  return fns

# 4. Loop + closure with local copy
outer4 = ->
  fns = []
  for i in [1, 2, 3]
    do (i) ->
      fns.push -> i  # each fn captures its own i
  return fns

# 5. Conditional block modifies outer variable
outer5 = ->
  result = 'default'
  flag = true
  if flag
    result = 'modified'
    inner = -> result = 'from inner'
    inner()
  return result

# 6. Try-catch modifies outer variable
outer6 = ->
  value = 0
  try
    value = 1
    inner = -> value = 2
    inner()
  catch e
    value = -1
  return value

# 7. While loop modifies outer variable
outer7 = ->
  count = 0
  sum = 0
  while count < 3
    count++
    sum += count
    adder = -> sum += 10
    adder()
  return sum

# 8. Function returns function that modifies outer
makeCounter = ->
  count = 0
  return ->
    count++
    return count

# 9. Object method accessing closure variable
outer9 = ->
  secret = 'hidden'
  obj = {
    get: -> secret
    set: (v) -> secret = v
  }
  return obj

# 10. Callback pattern with closure
outer10 = (callback) ->
  data = 'initial'
  doProcess = ->
    data = 'processed'
    callback(data)
  doProcess()
  return data

# 11. For-of with closure (the bug case)
outer11 = (obj) ->
  result = ''
  for key, value of obj
    result = "#{result}, #{key}: #{value}"
  return result

# 12. Mixed: array destructure in function with closure
outer12 = ->
  [a, b] = [1, 2]
  swap = ->
    temp = a
    a = b
    b = temp
  swap()
  return [a, b]

# 13. Parameter modification by inner function
outer13 = (x) ->
  doubler = -> x = x * 2
  doubler()
  return x

# 14. Rest parameter with closure
outer14 = (first, rest...) ->
  modify = -> first = 'changed'
  modify()
  return first
