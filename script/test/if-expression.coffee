# Top-level: basic ternary
a = if b then c else d

# Top-level: with number literals
x = if flag then 1 else 0

# Top-level: with string literals
msg = if error then "error" else "ok"

# Top-level: with comparison
status = if count > 0 then "有数据" else "无数据"

# Inside function: basic
fn = ->
  result = if condition then value1 else value2
  result

# Inside function: with literals
calc = (x) ->
  sign = if x > 0 then 1 else -1
  sign

# Multiple expressions
test = ->
  a = if flag1 then "a" else "b"
  b = if flag2 then 10 else 20
  return { a, b }
