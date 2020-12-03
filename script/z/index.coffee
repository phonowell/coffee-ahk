class A
  a: 0
  b: {}
  c:
    a: 1
  d: -> return 1
  e: (n) -> @a + n
  constructor: -> 1
b = new A()