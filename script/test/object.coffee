a = a: 1
a = a: 1, b: 2
a =
  a: 1
a =
  a: 1
  b: 2
a =
  a: 1
  b: 2
  c:
    a: 1, b: 2, c: 3

fn = ->
  a =
    a: 1
    b:
      a: 1
      b: 2
  d = 1

{a, b, c} =
  a: 1
  b: 2
  c: 3