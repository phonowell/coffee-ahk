a = 1
while a < 5
  a++
fn = -> while a < 5
  a++

# break/continue
b = 0
while b < 10
  b++
  if b == 3
    continue
  if b == 7
    break

# === Function context tests ===

# while modifying outer variable
fn1 = ->
  count = 0
  i = 0
  while i < 5
    count += i
    i++
  return count

# while with closure
fn2 = ->
  sum = 0
  i = 1
  while i <= 3
    adder = ->
      sum += i
    adder()
    i++
  return sum

# while with break and closure
fn3 = ->
  result = 0
  i = 0
  while true
    result = i
    i++
    checker = ->
      return i > 5
    if checker()
      break
  return result

# while with continue and closure
fn4 = ->
  total = 0
  i = 0
  while i < 10
    i++
    skipper = ->
      return i == 5
    if skipper()
      continue
    total += i
  return total

# Nested while with closure
fn5 = ->
  result = 0
  i = 0
  while i < 3
    j = 0
    while j < 3
      adder = ->
        result += 1
      adder()
      j++
    i++
  return result

# while condition uses closure var
fn6 = ->
  limit = 5
  count = 0
  i = 0
  checker = ->
    return i < limit
  while checker()
    count += 1
    i++
  return count