class A extends B

  a: 0
  b: {}
  c:
    a: 1

  constructor: ->
    super()
    super.a()
    do => @a

  d: -> 1
  e: (n) -> @a + n
  f: -> do => @a

b = new A()