fn = -> 1
fn = (a = 1) -> a
fn = (a, b...) -> b[1]
fn = (
  a = 1
  b = 2
) ->  a + b
fn(
  1
  2
)
fn fn fn
fn = (a, b, c) ->
  a
  b()
  c a
fn = ->
  a = 1
  return fn1 (a = a) ->
    b = 2
    return fn2 (a = a, b = b) ->
      c = 3
      return fn3 (a = a, b = b, c = c) ->
        a + b + c
do ->
  fn1 = -> a + b
  fn2 = (a) -> a + b
  fn3 = (a, b) -> a + b