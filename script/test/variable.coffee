a = 1
a = 2

fn = ->
  b = 1
  b = 2

c = 1
c = 2
fn = -> c = 3

[a, b] = [1, 2]
[a] = [1, 2, 3]
[a, b] = list
[a, b] = fn()

fn = -> [a, b, c] = [1, 2, 3]