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
  return c a
fn = ->
  a = 1
  return do (b = 2) -> do ->
    c = 3
    return do -> a + b + c
do ->
  fn1 = -> aGlobal + bGlobal
  fn2 = (aParam) -> aParam + bGlobal
  return fn3 = (aFn3, bFn3) -> aFn3 + bFn3