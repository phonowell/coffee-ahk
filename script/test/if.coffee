if a > 1 then 1
if a > 1 then 1 else 2
unless a > 1
  1
else
  2
unless a > 1
  1
else if a > 2
  2
else
  3
if a > 1
  if b > 1
    1
  else
    2
else
  3
fn = -> unless 1 then 1 else 2
unless fn 1 then 1 else 2

# === Function context tests ===

# if modifying outer variable
fn1 = ->
  result = 'default'
  flag = true
  if flag
    result = 'true branch'
  else
    result = 'false branch'
  return result

# if with closure
fn2 = ->
  value = 0
  condition = true
  if condition
    setter = ->
      value = 42
    setter()
  return value

# else branch with closure
fn3 = ->
  result = 'initial'
  flag = false
  if flag
    result = 'if'
  else
    modifier = ->
      result = 'else'
    modifier()
  return result

# Nested if with closure
fn4 = ->
  level = 0
  a = true
  b = true
  if a
    if b
      setter = ->
        level = 2
      setter()
    else
      level = 1
  return level

# if-else-if chain with closure
fn5 = ->
  result = 0
  x = 2
  if x == 1
    result = 1
  else if x == 2
    modifier = ->
      result = 22
    modifier()
  else
    result = 99
  return result

# unless with closure
fn6 = ->
  value = 'unchanged'
  flag = false
  unless flag
    changer = ->
      value = 'changed'
    changer()
  return value

# Condition evaluated with closure var
fn7 = ->
  threshold = 10
  value = 15
  result = 'below'
  checker = ->
    return value > threshold
  if checker()
    result = 'above'
  return result