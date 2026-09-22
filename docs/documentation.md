# Documentation

You can think of `Coffee-AHK` as a dialect of `CoffeeScript` that compiles to AutoHotkey v1 scripts. It is compatible with existing `AHK` code and adds modern features such as classes, modules, functional programming, destructuring assignment, and various syntactic sugar. Note: AutoHotkey is case-insensitive.

See [README.md](../README.md) for installation, options, and the full feature/limitation matrix. See [USAGE.md](../USAGE.md) for a condensed writer's guide.

## Overview

`Coffee-AHK` at the top, compiled `AHK` output at the bottom. Generated function names are prefixed with `salt` (a deterministic hash of the source by default, e.g. `s1f8zyy3`); closures receive a context object `λ` holding captured variables.

```coffeescript
# assignment:
count = 42
opposite = true

# conditions:
if opposite then count = -42

# functions:
square = (x) -> x * x

# arrays:
list = [1, 2, 3, 4, 5]

# object:
math =
  root: Math.sqrt
  square: square
  cube: (x) -> x * square x

# splats:
race = (winner, runners...) ->
  print winner, runners
```

```ahk
global count := 42
global opposite := true
if (opposite) {
  count := -42
}
global square := Func("s1f8zyy3_3").Bind({})
global list := [1, 2, 3, 4, 5]
global math := {root: Math.sqrt, square: square, cube: Func("s1f8zyy3_2").Bind({})}
global race := Func("s1f8zyy3_1").Bind({})
s1f8zyy3_1(λ, winner, runners*) {
  λ.winner := winner
  λ.runners := runners
  return λ.print.Call(λ.winner, λ.runners)
}
s1f8zyy3_2(λ, x) {
  λ.x := x
  return λ.x * square.Call(λ.x)
}
s1f8zyy3_3(λ, x) {
  λ.x := x
  return λ.x * λ.x
}
```

## Installation

```shell
# install locally for a project:
pnpm install coffee-ahk
```

## Language Reference

First, the basics: `Coffee-AHK` uses significant whitespace to delimit blocks of code. You don't need to use semicolons `;` to terminate expressions, terminating the line will do just as well (although semicolons can still be used to fit multiple expressions on a single line). Instead of using curly braces `{}` to enclose blocks of code in functions, if-statements, switches, and try/catch, use indentation.

You don't need to use parentheses to call a function when passing arguments. The implicit call wraps forward to the end of the line or block expression.

`console.log sys.inspect object` → `console.log(sys.inspect(object));`

All functions starting with an uppercase letter are treated as built-in functions and are not wrapped in `Func(...).Call(...)`.

## Functions

Functions are defined by an optional list of parameters in parentheses, an arrow, and the function body. The empty function looks like this: `->`.

```coffeescript
square = (x) -> x * x
cube = (x) -> square(x) * x
```

```ahk
global square := Func("s1x2rg3o_2").Bind({})
global cube := Func("s1x2rg3o_1").Bind({})
s1x2rg3o_1(λ, x) {
  λ.x := x
  return square.Call(λ.x) * λ.x
}
s1x2rg3o_2(λ, x) {
  λ.x := x
  return λ.x * λ.x
}
```

Functions may also have default values for arguments, which are used if the incoming argument is missing (`undefined`).

```coffeescript
fill = (container, liquid = 'coffee') ->
  return "Filling the #{container} with #{liquid}..."
```

```ahk
global fill := Func("sb9pzs1_1").Bind({})
sb9pzs1_1(λ, container, liquid := "coffee") {
  λ.container := container
  λ.liquid := liquid
  return "Filling the " . (λ.container) . " with " . (λ.liquid) . "..."
}
```

Implicit return: a function whose body is a single statement/expression returns it automatically. Bodies with multiple statements require an explicit `return`. Exception: an `if`/`else if`/`else` chain as the last statement of a function body returns the taken branch's last expression — this also applies in multi-statement bodies, and a nested tail `if` recurses into its own branches. `for`/`while`/`try`/native bodies are never implicitly returned.

## Strings

Like JavaScript and many other languages, `Coffee-AHK` supports strings delimited by the `"` or `'` characters. Coffee-AHK also supports string interpolation within `"`-quoted strings using `#{ ... }`. Single quoted strings are literal. You can even use interpolation in object keys.

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

Multiline strings are allowed in `Coffee-AHK`. Lines are separated by a single space unless they end with a backslash. Indentation is ignored.

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

Block strings (`'''` / `"""`) keep their newlines as `` `n ``:

```coffeescript
html = '''
<strong>
  cup of coffee-ahk
</strong>
'''
```

```ahk
global html := "<strong>`n  cup of coffee-ahk`n</strong>"
```

Double-quoted block strings, like other double-quoted strings, allow interpolation.

## Objects and Arrays

The `Coffee-AHK` literals for objects and arrays look a lot like their JavaScript cousins. If each property is listed on a separate line, the commas are optional. Objects can be created using indentation instead of explicit curly braces, similar to `YAML`.

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

`Coffee-AHK` has a shortcut for creating objects when you want the key to be set with a variable of the same name. Note that the `{` and `}` are required for this shortcut.

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

In `Coffee-AHK` comments are indicated by the character `#` to the end of the line, or from `###` to the next occurrence of `###`.

## If, Else, Unless, and Conditional Assignment

`if`/`else` statements can be written without parentheses or braces. As with functions and other block expressions, multiline conditionals are delimited by indentation.

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
  global mood := greatlyImproved
}
if (happy && knowsIt) {
  clapsHands.Call()
  chaChaCha.Call()
} else {
  showIt.Call()
}
if (friday) {
  global date := sue
} else {
  date := jill
}
```

`if`/`else` is also an expression: on the right side of `=`, after `return`/`throw`, and inside parentheses it compiles to a ternary. A missing `else` yields `""`, and `else if` chains become right-associative ternaries. Inside call arguments, arrays, index brackets, and object literals it is not supported (compiler error) — assign to a variable first. Nested if-expressions are not supported either.

An `if`/`else` chain that is the last statement of a function body also serves as the return value: `return` is injected before each branch's last statement, recursing into nested tail `if`s.

```coffeescript
status = if count > 0 then "ok" else "empty"
maybe = if count > 0 then "ok"

sign = (x) ->
  if x > 0 then "positive"
  else if x < 0 then "negative"
  else "zero"
```

```ahk
global status := count > 0 ? "ok" : "empty"
global maybe := count > 0 ? "ok" : ""
global sign := Func("s1x8k2m_1").Bind({})
s1x8k2m_1(λ, x) {
  λ.x := x
  if (λ.x > 0) {
    return "positive"
  } else if (λ.x < 0) {
    return "negative"
  } else {
    return "zero"
  }
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
global awardMedals := Func("s4v00up_1").Bind({})
global contenders := ["Michael Phelps", "Liu Xiang", "Yao Ming"]
awardMedals.Call(contenders*)
alert.Call(" Gold: " . (gold) . " Silver: " . (silver) . " The Field: " . (rest.join.Call(", ")) . " ")
s4v00up_1(λ, first, second, others*) {
  λ.first := first
  λ.second := second
  λ.others := others
  gold := λ.first
  silver := λ.second
  rest := λ.others
}
```

Spread calls use the same postfix form — `f(...args)` compiles to `f.Call(args*)`. Only plain identifiers can be spread: `f(...a.b)` is a compile error — assign to a variable first. There is no `arguments` object and no `eval` in AHK v1; both are compile errors (use a rest parameter instead).

## Loops

```coffeescript
# Eat lunch.
eat = (food) -> "#{food} eaten."
for food in ['toast', 'cheese', 'wine']
  eat food

# Fine five course dining.
courses = ['greens', 'caviar', 'truffles', 'roast', 'cake']
menuText = (i, dish) -> "Menu Item #{i}: #{dish}"
for dish, i in courses
  menuText i + 1, dish

# Health conscious meal.
foods = ['broccoli', 'spinach', 'chocolate']
for food in foods
  if food isnt 'chocolate' then eat food
```

```ahk
global eat := Func("s1ut5k8k_2").Bind({})
for ℓi, food in ["toast", "cheese", "wine"] {
  global food
  eat.Call(food)
}
global courses := ["greens", "caviar", "truffles", "roast", "cake"]
global menuText := Func("s1ut5k8k_1").Bind({})
for i, dish in courses {
  global dish
  global i := i - 1
  menuText.Call(i + 1, dish)
}
global foods := ["broccoli", "spinach", "chocolate"]
for ℓi, food in foods {
  if (food != "chocolate") {
    eat.Call(food)
  }
}
s1ut5k8k_1(λ, i, dish) {
  λ.i := i
  λ.dish := dish
  return "Menu Item " . (i) . ": " . (dish) . ""
}
s1ut5k8k_2(λ, food) {
  λ.food := food
  return "" . (food) . " eaten."
}
```

Note: `for item, i in array` gives a 0-based `i` (the generated `i := i - 1` converts AHK's 1-based loop index). Loops without an index variable use the internal `ℓi` placeholder.

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
  global child
  global age
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

`Coffee-AHK` compiles `is` to `==` and `isnt` to `!=`.

You can use `not` as an alias for `!`.

For logic, `and` compiles to `&&`, and `or` compiles to `||`. In AHK these operators return boolean `0`/`1`, not an operand value — so on the right side of `=`, a `||`/`&&` chain ending in a non-boolean literal is rewritten to a value-preserving ternary (`x = a || "d"` behaves like `x := a ? a : "d"`). Elsewhere (conditions, call arguments, `return`) they keep boolean semantics.

Instead of a newline or semicolon, `then` can be used to separate conditions from expressions in `while`, `if`/`else`, and `switch`/`when` statements.

As in `YAML`, `on` and `yes` are the same as boolean `true`, while `off` and `no` are boolean `false`.

`unless` can be used as the inverse of if.

As a shortcut for `this.property` you can use `@property`.

To simplify mathematical expressions, `**` can be used for exponentiation.

Floor division (`//`, `//=`) and modulo (`%`, `%%`) are **not supported** — they conflict with AHK comment/variable syntax and raise a compile error. Use `Floor(a / b)` or `Mod(a, b)` instead.

All together now:

|     `Coffee-AHK`     |  `AHK`   |
| :------------------: | :------: |
|         `is`         |   `==`   |
|        `isnt`        |   `!=`   |
|        `not`         |   `!`    |
|        `and`         |   `&&`   |
|         `or`         |  `\|\|`  |
| `true`, `yes`, `on`  |  `true`  |
| `false`, `no`, `off` | `false`  |
|     `@`, `this`      |  `this`  |
|       `a ** b`       | `a ** b` |

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
  global volume := 10
}
if !(answer == false) {
  letTheWildRumpusBegin.Call()
}
if (car.speed < limit) {
  accelerate.Call()
}
print.Call(inspect.Call("My name is " . (this.name) . ""))
```

## Chained Calls

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
$.Call("body").click.Call(Func("s10lsi7s_1").Bind({})).css.Call("background", "white")
s10lsi7s_1(λ, e) {
  λ.e := e
  return λ.$.Call(".box").fadeIn.Call("fast").addClass.Call("show")
}
```

## Destructuring Assignment

Just like `JavaScript`, `Coffee-AHK` has destructuring assignment syntax. When you assign an array or object literal to a value, `Coffee-AHK` breaks it up and matches both sides against each other, assigning the values on the right to the variables on the left. In the simplest case, it can be used for parallel assignment:

```coffeescript
theBait = 1e3
theSwitch = 0

[theBait, theSwitch] = [theSwitch, theBait]
```

```ahk
global theBait := 1000
global theSwitch := 0
global ℓarray := [theSwitch, theBait]
theBait := ℓarray[1]
theSwitch := ℓarray[2]
```

But it's also useful for dealing with functions that return multiple values.

```coffeescript
weatherReport = (location) ->
  return [location, 72, 'Mostly Sunny']

[city, temp, forecast] = weatherReport 'Berkeley, CA'
```

```ahk
global weatherReport := Func("s1lu25uy_1").Bind({})
global ℓarray := weatherReport.Call("Berkeley, CA")
global city := ℓarray[1]
global temp := ℓarray[2]
global forecast := ℓarray[3]
s1lu25uy_1(λ, location) {
  λ.location := location
  return [λ.location, 72, "Mostly Sunny"]
}
```

Nested destructuring (`[a, [b, c]] = x`) and destructuring in `for` loops are not supported — destructure in a separate statement instead.

## Class

Since `AHK` is not case-sensitive, please do not use this way: `item = new Item()`. Instead, it should be written like this: `item2 = new Item()`.

Class names must start with an uppercase letter and be at least 2 characters long. In the generated code, uppercase letters inside class identifiers are replaced by full-width Unicode to simulate case-sensitivity (`Animal` → `Ａnimal`).

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
class Ａnimal {
  __New(name) {
    this.name := name
  }
  move := Func("s1cfr26x_3").Bind({}, this)
}
class Ｓnake extends Ａnimal {
  move := Func("s1cfr26x_2").Bind({}, this)
}
class Ｈorse extends Ａnimal {
  move := Func("s1cfr26x_1").Bind({}, this)
}
global sam := new Ｓnake("Sammy the Python")
global tom := new Ｈorse("Tommy the Palomino")
sam.move.Call()
tom.move.Call()
s1cfr26x_1(λ, ℓthis) {
  this := ℓthis
  λ.alert.Call("Galloping...")
  base.move.Call(45)
}
s1cfr26x_2(λ, ℓthis) {
  this := ℓthis
  λ.alert.Call("Slithering...")
  base.move.Call(5)
}
s1cfr26x_3(λ, ℓthis, meters) {
  this := ℓthis
  λ.meters := meters
  return λ.alert.Call(this.name + " moved " . (λ.meters) . "m.")
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
catch err
  print err
finally
  cleanUp()
```

```ahk
try {
  allHellBreaksLoose.Call()
  catsAndDogsLivingTogether.Call()
} catch err {
  global err
  print.Call(err)
} finally {
  cleanUp.Call()
}
```

## Reserved Words

AHK built-in names (e.g. `number`, `menu`, `error`) and anything starting with `A_` cannot be used as variables, parameters, `catch`/`for` variables, destructuring targets, or class names — the compiler raises a `forbidden` error. See `data/forbidden.yaml` for the list.

## Modules

```coffeescript
import './local-file.coffee'
import 'js-shim.ahk' # resolved via ./node_modules

import fn from './source/fn'

import data from './data.json'
import data2 from './data.yaml'
```

Supported forms: side-effect (`import './m'`), default (`import m from './m'`), named (`import { a, b } from './m'`), and mixed. `export default` and `export { a, b }` are supported (`export {}` is a legal no-op; a second `export default` is a compile error). `import * as`, `import { x as y }`, and `export const` are not. `import`/`export` only work in file-based compilation — `export` in string input raises an error. Lines that merely look like imports inside heredocs or `###` block comments are ignored.

Classes cannot be exported — modules are wrapped for scope isolation and AHK classes must live at the top level. Define classes in a separate file and pull them in with a side-effect import.

## Native AHK

If you ever need to insert snippets of `AHK` into your `Coffee-AHK`, you can use backticks to pass it straight through.

```coffeescript
hi = ->
  msg = 'Hello AHK'
  `MsgBox, % msg`
```

```ahk
global hi := Func("s13ownkq_1").Bind({})
s13ownkq_1(λ) {
  λ.msg := "Hello AHK"
  λ_msg := λ.msg
  MsgBox, % λ_msg
  λ.msg := λ_msg
}
```

Inside functions, native blocks bridge closure variables through temporary variables (`λ_msg` above): the value is copied out before the block and written back after, so legacy AHK commands like `MsgBox`/`Sort` can operate on them.
