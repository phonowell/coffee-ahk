class TestClass
  method: (x) ->
    inner = => return this
    inner()
