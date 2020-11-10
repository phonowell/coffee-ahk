fn = -> 1
fn = (a = 1) -> return a
fn = (a, b...) -> return b[1]
fn = (
  a = 1
  b = 2
) -> return a + b
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
        return a + b + c