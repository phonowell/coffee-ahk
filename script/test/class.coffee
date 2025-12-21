# Basic class with inheritance
class Bb
  a: -> 42
class Aa extends Bb

  a: 0
  b: {}
  c:
    a: 1

  constructor: ->
    super()
    super.a()
    return do => @a

  d: -> 1
  e: (n) -> @a + n
  f: -> do => @a

b = new Aa()

# Class with constructor parameters
class Person
  constructor: (name, age) ->
    @name = name
    @age = age

  greet: (greeting) ->
    "#{greeting}, #{@name}!"

  getInfo: ->
    { name: @name, age: @age }

# Class method with multiple parameters
class Calculator
  constructor: (initial) ->
    @value = initial

  add: (x, y) ->
    x + y

  multiply: (a, b, c) ->
    a * b * c

  chain: (n) ->
    @value = @value + n
    return this

# Class with nested arrow function accessing this
class Counter
  constructor: ->
    @count = 0

  increment: ->
    do => @count = @count + 1

  getCounter: ->
    do => @count

# Class with method calling another method
class Greeter
  constructor: (prefix) ->
    @prefix = prefix

  format: (text) ->
    "#{@prefix}: #{text}"

  say: (message) ->
    @format(message)

# Class with property arrow function accessing this
class KeyBindingShell
  constructor: ->
    @mapBound = {}
    @mapCallback = {}
    @mapPrevented = {}

  prepare: (key) ->
    if @mapCallback[key] then return
    @mapBound[key] = => @fire key
    @mapCallback[key] = []
    @mapPrevented[key] = false
    return

  fire: (key) ->
    console.log "Firing: " . key

# Instantiation
person = new Person("Alice", 30)
calc = new Calculator(10)
counter = new Counter()
greeter = new Greeter("Info")