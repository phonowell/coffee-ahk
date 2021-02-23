# Documentation

You can think of `Coffee-AHK` as a dialect of `CoffeeScript`. It is compatible with the existing `AHK` code and adds new features to `AHK` such as `anonymous functions`, `destructuring assignment` and even `package management support`. It is also a subset of `CoffeeScript`, which compiles into `JavaScript` code correctly for execution on all platforms.

Latest Version: **0.0.32**

## Overview

`Coffee-AHK` on the top, compiled `AHK` output on the bottom.

```coffeescript
# assignment:
number = 42
opposite = true

# conditions:
if opposite then number = -42

# functions:
square = (x) -> return x * x

# arrays:
list = [1, 2, 3, 4, 5]

# object:
math =
  root: Math.sqrt
  square: square
  cube: (x) -> return x * square x

# splats:
race = (winner, runners...) ->
  print winner, runners
```

```ahk
global number := 42
global opposite := true
if (opposite) {
  number := -42
}
global square := Func("ahk_3")
global list := [1, 2, 3, 4, 5]
global math := {root: Math.sqrt, square: square, cube: Func("ahk_2")}
global race := Func("ahk_1").Bind(print)
ahk_1(print, winner, runners*) {
  print.Call(winner, runners)
}
ahk_2(x) {
  return x * square.Call(x)
}
ahk_3(x) {
  return x * x
}
```

## Installation

```shell
# install locally for a project:
npm install coffee-ahk
```

## Language Reference

First, the basics: `Coffee-AHK` uses significant whitespace to delimit blocks of code. You don’t need to use semicolons `;` to terminate expressions, ending the line will do just as well (although semicolons can still be used to fit multiple expressions onto a single line). Instead of using curly braces `{ }` to surround blocks of code in functions, if-statements, switch, and try/catch, use indentation.

You don’t need to use parentheses to invoke a function if you’re passing arguments. The implicit call wraps forward to the end of the line or block expression.
`console.log sys.inspect object` → `console.log(sys.inspect(object));`

## Functions

Functions are defined by an optional list of parameters in parentheses, an arrow, and the function body. The empty function looks like this: `->`

Note that all functions starting with an uppercase letter are treated as built-in functions.

```coffeescript
square = (x) -> return x * x
cube = (x) -> return square(x) * x
```

```ahk
global square := Func("ahk_2")
global cube := Func("ahk_1")
ahk_1(x) {
  return square.Call(x) * x
}
ahk_2(x) {
  return x * x
}
```

Functions may also have default values for arguments, which will be used if the incoming argument is missing (`undefined`).

```coffeescript
fill = (container, liquid = 'coffee') ->
  return "Filling the #{container} with #{liquid}..."
```

```ahk
global fill := Func("ahk_1")
ahk_1(container, liquid := "coffee") {
  return "Filling the " . (container) . " with " . (liquid) . "..."
}
```

## Strings

Like JavaScript and many other languages, `Coffee-AHK` supports strings as delimited by the `"` or `'` characters. `Coffee-AHK` also supports string interpolation within `"`-quoted strings, using `#{ … }`. Single-quoted strings are literal. You may even use interpolation in object keys.

```coffeescript
author = 'Wittgenstein'
quote = "A picture is a fact. -- #{ author }"

sentence = "#{ 22 / 7 } is a decent approximation of π"
```

```ahk
global author := "Wittgenstein"
global quote := "A picture is a fact. -- " . (author) . ""
global sentence := "" . (22 / 7) . " is a decent approximation of π"
```

Multiline strings are allowed in `Coffee-AHK`. Lines are joined by a single space unless they end with a backslash. Indentation is ignored.

```coffeescript
mobyDick = 'Call me Ishmael. Some years ago --
  never mind how long precisely -- having little
  or no money in my purse, and nothing particular
  to interest me on shore, I thought I would sail
  about a little and see the watery part of the
  world...'
```

```ahk
global mobyDick := "Call me Ishmael. Some years ago -- never mind how long precisely -- having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world..."
```

```coffeescript
html = '''
<strong>
  cup of coffee-ahk
</strong>
'''
```

```ahk
global html := "<strong>cup of coffee-ahk</strong>"
```

Double-quoted block strings, like other double-quoted strings, allow interpolation.

## Objects and Arrays

The `Coffee-AHK` literals for objects and arrays look very similar to their JavaScript cousins. When each property is listed on its own line, the commas are optional. Objects may be created using indentation instead of explicit braces, similar to `YAML`.

```coffeescript
song = ['do', 're', 'mi', 'fa', 'so']

singers = {Jagger: 'Rock', Elvis: 'Roll'}

bitlist = [
  1, 0, 1
  0, 0, 1
  1, 1, 0
]

kids =
  brother:
    name: 'Max'
    age: 11
  sister:
    name: 'Ida'
    age: 9
```

```ahk
global song := ["do", "re", "mi", "fa", "so"]
global singers := {Jagger: "Rock", Elvis: "Roll"}
global bitlist := [1, 0, 1, 0, 0, 1, 1, 1, 0]
global kids := {brother: {name: "Max", age: 11}, sister: {name: "Ida", age: 9}}
```

`Coffee-AHK` has a shortcut for creating objects when you want the key to be set with a variable of the same name. Note that the `{` and `}` are required for this shorthand.

```coffeescript
name = 'Michelangelo'
mask = 'orange'
weapon = 'nunchuks'
turtle = {name, mask, weapon}
output = "#{turtle.name} wears an #{turtle.mask} mask. Watch out for his #{turtle.weapon}!"
```

```ahk
global name := "Michelangelo"
global mask := "orange"
global weapon := "nunchuks"
global turtle := {name: name, mask: mask, weapon: weapon}
global output := "" . (turtle.name) . " wears an " . (turtle.mask) . " mask. Watch out for his " . (turtle.weapon) . "!"
```

## Comments

In `Coffee-AHK`, comments are denoted by the `#` character to the end of a line, or from `###` to the next appearance of `###`.

## If, Else, Unless, and Conditional Assignment

`if`/`else` statements can be written without the use of parentheses and curly brackets. As with functions and other block expressions, multi-line conditionals are delimited by indentation.

```coffeescript
if singing then mood = greatlyImproved

if happy and knowsIt
  clapsHands()
  chaChaCha()
else
  showIt()

if friday
  date = sue
else date = jill
```

```ahk
if (singing) {
  mood := greatlyImproved
}
if (happy && knowsIt) {
  clapsHands.Call()
  chaChaCha.Call()
} else {
  showIt.Call()
}
if (friday) {
  date := sue
} else {
  date := jill
}
```

## Splats, or Rest Parameters

```coffeescript
gold = 'unknown'
silver = 'unknown'
rest = 'unknown'

awardMedals = (first, second, others...) ->
  gold = first
  silver = second
  rest = others

contenders = [
  'Michael Phelps'
  'Liu Xiang'
  'Yao Ming'
  'Allyson Felix'
  'Shawn Johnson'
  'Roman Sebrle'
  'Guo Jingjing'
  'Tyson Gay'
  'Asafa Powell'
  'Usain Bolt'
]

awardMedals contenders...

alert "
Gold: #{gold}
Silver: #{silver}
The Field: #{rest.join ', '}
"
```

```ahk
global gold := "unknown"
global silver := "unknown"
global rest := "unknown"
global awardMedals := Func("ahk_1")
global contenders := ["Michael Phelps", "Liu Xiang", "Yao Ming", "Allyson Felix", "Shawn Johnson", "Roman Sebrle", "Guo Jingjing", "Tyson Gay", "Asafa Powell", "Usain Bolt"]
awardMedals.Call(contenders*)
alert.Call(" Gold: " . (gold) . " Silver: " . (silver) . " The Field: " . (rest.join.Call(", ")) . " ")
ahk_1(first, second, others*) {
  gold := first
  silver := second
  rest := others
}
```

## Loops

```coffeescript
# Eat lunch.
eat = (food) -> return "#{food} eaten."
for food in ['toast', 'cheese', 'wine']
  eat food

# Fine five course dining.
courses = ['greens', 'caviar', 'truffles', 'roast', 'cake']
menu = (i, dish) -> return "Menu Item #{i}: #{dish}"
for dish, i in courses
  menu i + 1, dish

# Health conscious meal.
foods = ['broccoli', 'spinach', 'chocolate']
for food in foods
  if food isnt 'chocolate' then eat food
```

```ahk
global eat := Func("ahk_2")
for __index_for__, food in ["toast", "cheese", "wine"] {
  eat.Call(food)
}
global courses := ["greens", "caviar", "truffles", "roast", "cake"]
global menu := Func("ahk_1")
for i, dish in courses {
  i := i - 1
  menu.Call(i + 1, dish)
}
global foods := ["broccoli", "spinach", "chocolate"]
for __index_for__, food in foods {
  if (food != "chocolate") {
    eat.Call(food)
  }
}
ahk_1(i, dish) {
  return "Menu Item " . (i) . ": " . (dish) . ""
}
ahk_2(food) {
  return "" . (food) . " eaten."
}
```

Use `of` to signal comprehension over the properties of an object instead of the values in an array.

```coffeescript
yearsOld = max: 10, ida: 9, tim: 11

ages = []
for child, age of yearsOld
  ages.Push "#{child} is #{age}"
```

```ahk
global yearsOld := {max: 10, ida: 9, tim: 11}
global ages := []
for child, age in yearsOld {
  ages.Push("" . (child) . " is " . (age) . "")
}
```

```coffeescript
# Econ 101
if @studyingEconomics
  while supply > demand
    buy()
  until supply > demand
    sell()

# Nursery Rhyme
num = 6
lyrics = []
while num
  num = num - 1
  lyrics.Push "#{num} little monkeys, jumping on the bed. One fell out and bumped his head."
```

```ahk
if (this.studyingEconomics) {
  while (supply > demand) {
    buy.Call()
  }
  while !(supply > demand) {
    sell.Call()
  }
}
global num := 6
global lyrics := []
while (num) {
  num := num - 1
  lyrics.Push("" . (num) . " little monkeys, jumping on the bed. One fell out and bumped his head.")
}
```

For readability, the `until` keyword is equivalent to `while not`, and the `loop` keyword is equivalent to `while true`.

## Operators and Aliases

`Coffee-AHK` compiles `is` compiles into `==`, and `isnt` into `!=`.

You can use `not` as an alias for `!`.

For logic, `and` compiles to `&&`, and `or` into `||`.

Instead of a newline or semicolon, `then` can be used to separate conditions from expressions, in `while`, `if`/`else`, and `switch`/`when` statements.

As in `YAML`, `on` and `yes` are the same as boolean `true`, while `off` and `no` are boolean `false`.

`unless` can be used as the inverse of `if`.

As a shortcut for `this.property`, you can use `@property`.

To simplify math expressions, `**` can be used for exponentiation and `//` performs floor division.

All together now:

| `Coffee-AHK` | `AHK` |
| :---: | :---: |
| `is` | `==` |
| `isnt` | `!=` |
| `not` | `!` |
| `and` | `&&` |
| `or` | `\|\|` |
| `true`, `yes`, `on` | `true` |
| `false`, `no`, `off` | `false` |
| `@`, `this` | `this` |
| `a ** b` | `a ** b` |
| `a // b` | `a // b` |

```coffeescript
if ignition is on then launch()

if band isnt SpinalTap then volume = 10

unless answer is no then letTheWildRumpusBegin()

if car.speed < limit then accelerate()

print inspect "My name is #{@name}"
```

```ahk
if (ignition == true) {
  launch.Call()
}
if (band != SpinalTap) {
  volume := 10
}
if !(answer == false) {
  letTheWildRumpusBegin.Call()
}
if (car.speed < limit) {
  accelerate.Call()
}
print.Call(inspect.Call("My name is " . (this.name) . ""))
```

## Chaining Function Calls

Leading `.` closes all open calls, allowing for simpler chaining syntax.

```coffeescript
$ 'body'
  .click (e) ->
    $ '.box'
      .fadeIn 'fast'
      .addClass 'show'
  .css 'background', 'white'
```

```ahk
$.Call("body").click.Call(Func("ahk_1").Bind($)).css.Call("background", "white")
ahk_1($, e) {
  $.Call(".box").fadeIn.Call("fast").addClass.Call("show")
}
```

## Destructuring Assignment

Just like `JavaScript`, `Coffee-AHK` has destructuring assignment syntax. When you assign an array or object literal to a value, `Coffee-AHK` breaks up and matches both sides against each other, assigning the values on the right to the variables on the left. In the simplest case, it can be used for parallel assignment:

```coffeescript
theBait = 1e3
theSwitch = 0

[theBait, theSwitch] = [theSwitch, theBait]
```

```ahk
global theBait := 1000
global theSwitch := 0
global __array__ := [theSwitch, theBait]
theBait := __array__[1]
theSwitch := __array__[2]
```

But it’s also helpful for dealing with functions that return multiple values.

```coffeescript
weatherReport = (location) ->
  # Make an Ajax request to fetch the weather...
  return [location, 72, 'Mostly Sunny']

[city, temp, forecast] = weatherReport 'Berkeley, CA'
```

```ahk
global weatherReport := Func("ahk_1")
global __array__ := weatherReport.Call("Berkeley, CA")
global city := __array__[1]
global temp := __array__[2]
global forecast := __array__[3]
ahk_1(location) {
  return [location, 72, "Mostly Sunny"]
}
```

## Classes

Since `AHK` is not case-sensitive, please do not use this way of writing: `item = new Item()`. Instead, it should be written like this: `item = new ItemX()`.

```coffeescript
class Animal
  constructor: (name) -> @name = name

  move: (meters) ->
    alert @name + " moved #{meters}m."

class Snake extends Animal
  move: ->
    alert 'Slithering...'
    super.move 5

class Horse extends Animal
  move: ->
    alert 'Galloping...'
    super.move 45

sam = new Snake 'Sammy the Python'
tom = new Horse 'Tommy the Palomino'

sam.move()
tom.move()
```

```ahk
class Animal {
  __New(name) {
    this.name := name
  }
  move := Func("ahk_3").Bind(alert).Bind(this)
}
class Snake extends Animal {
  move := Func("ahk_2").Bind(alert).Bind(this)
}
class Horse extends Animal {
  move := Func("ahk_1").Bind(alert).Bind(this)
}
global sam := new Snake("Sammy the Python")
global tom := new Horse("Tommy the Palomino")
sam.move.Call()
tom.move.Call()
ahk_1(alert, this) {
  alert.Call("Galloping...")
  base.move.Call(45)
}
ahk_2(alert, this) {
  alert.Call("Slithering...")
  base.move.Call(5)
}
ahk_3(alert, this, meters) {
  alert.Call(this.name + " moved " . (meters) . "m.")
}
```

## Switch/When/Else

```coffeescript
switch day
  when 'Mon' then go work
  when 'Tue' then go relax
  when 'Thu' then go iceFishing
  when 'Fri', 'Sat'
    if day is bingoDay
      go bingo
      go dancing
  when 'Sun' then go church
  else go work
```

```ahk
switch day {
  case "Mon": {
    go.Call(work)
  }
  case "Tue": {
    go.Call(relax)
  }
  case "Thu": {
    go.Call(iceFishing)
  }
  case "Fri", "Sat": {
    if (day == bingoDay) {
      go.Call(bingo)
      go.Call(dancing)
    }
  }
  case "Sun": {
    go.Call(church)
  }
  default: {
    go.Call(work)
  }
}
```

## Try/Catch/Finally

```coffeescript
try
  allHellBreaksLoose()
  catsAndDogsLivingTogether()
catch error
  print error
finally
  cleanUp()
```

```ahk
try {
  allHellBreaksLoose.Call()
  catsAndDogsLivingTogether.Call()
} catch error {
  print.Call(error)
} finally {
  cleanUp.Call()
}
```

## Modules

```coffeescript
import './local-file.coffee'
import 'js-shim.ahk' # via npm

import fn from './source/fn'
```

## Embedded AHK

If you ever need to intersperse snippets of `AHK` within your `Coffee-AHK`, you can use backticks to pass it straight through.

```coffeescript
hi = ->
  msg = 'Hello AHK'
  `MsgBox, % msg`
```

```ahk
global hi := Func("ahk_1")
ahk_1() {
  msg := "Hello AHK"
  MsgBox, % msg
}
```