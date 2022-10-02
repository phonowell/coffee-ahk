# 文档 Documentation

你可以把`Coffee-AHK`看作是`CoffeeScript`的一种方言。它与现有的`AHK`代码兼容，并为其增加了诸如`匿名函数`、`赋值解构`乃至`包管理支持`等新功能。它同时也是`CoffeeScript`的子集，可以正确编译成`JavaScript`代码，并在全平台上运行。

You can think of `Coffee-AHK` as a dialect of `CoffeeScript`. It is compatible with existing `AHK` code and adds new features such as `anonymous functions`, `destructuring assignment`, and even `package management support`. It is also a subset of `CoffeeScript` that can be correctly compiled to `JavaScript` code and run on all platforms.

最新版本：**0.0.44**

Latest version: **0.0.44**

## 概览 Overview

上方为`Coffee-AHK`代码，下方为翻译后的`AHK`代码。

`Coffee-AHK` on the top, compiled `AHK` output on the bottom.

```coffee

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

## 安装 Installation

```shell
# install locally for a project:
pnpm install coffee-ahk
```

## 语言参考 Language Reference

首先，`Coffee-AHK`使用有语义的空格和换行。你可以直接通过换行来终止表达式，而不需要显式书写`;`（除非你需要将多个表达式写在同一行）。而在函数、`if`语句、`switch`语句或`try`/`catch`中，你需要使用缩进替代包围代码块的`{}`来划分代码块。

First, the basics: `Coffee-AHK` uses significant whitespace to delimit blocks of code. You don’t need to use semicolons `;` to terminate expressions, ending the line will do just as well (although semicolons can still be used to fit multiple expressions onto a single line). Instead of using curly braces `{ }` to surround blocks of code in functions, if-statements, switch, and try/catch, use indentation.

在执行函数时，你不需要显式使用`()`来包裹参数。隐式调用会自动帮你处理好这些。
`console.log sys.inspect object` → `console.log(sys.inspect(object));`

You don’t need to use parentheses to invoke a function if you’re passing arguments. The implicit call wraps forward to the end of the line or block expression.
`console.log sys.inspect object` → `console.log(sys.inspect(object));`

## 函数 Functions

函数由括号中的参数、箭头和函数体三部分构成。一个最简单的空函数长这样：`->`。

Functions are defined by an optional list of parameters in parentheses, an arrow, and the function body. The empty function looks like this: `->`

注意，所有以大写字母开头的函数都被视作内置函数。

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

函数参数可以设置默认值，当参数不传时（即为`undefined`时），其将被置为该值。

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

## 字符串 Strings

如同`JavaScript`和其他许多语言一样，`Coffee-AHK`同时支持`'`和`"`。`Coffee-AHK`也支持使用`#{ ... }`的形式，在`"`包裹的字符串中进行字符串插值，甚至在对象的键名中你也可以这么做。

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

`Coffee-AHK`中可以使用多行字符串。换行会被转为一个空格，而缩进则被忽略。

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

双引号包括的块状字符串也可以进行插值。

Double-quoted block strings, like other double-quoted strings, allow interpolation.

## 对象与数组 Objects and Arrays

`Coffee-AHK`中的对象与数组看起来同`JavaScript`非常相似。当每个属性都单独成行时，句末的`,`是可以省略的。你也可以使用缩进代替`{}`来创建对象，就像在`YAML`中那样。

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

在用同名变量来设置键时，你可以使用如下简便写法。注意，此时必须显式写下`{`和`}`。

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

## 注释 Comments

`Coffee-AHK`中使用`#`来表示行注释，使用`###`来表示块注释。

In `Coffee-AHK`, comments are denoted by the `#` character to the end of a line, or from `###` to the next appearance of `###`.

## If, Else, Unless, and Conditional Assignment

`if`/`else`可以不使用`{}`包裹。你可以同其他块状表达式一样，使用缩进来划分它们。

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

## 循环 Loops

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

当循环对象时，使用`of`来替代`in`。

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

`until`相当于`while not`，`loop`相当于`while true`。

For readability, the `until` keyword is equivalent to `while not`, and the `loop` keyword is equivalent to `while true`.

## 操作符与别名 Operators and Aliases

在`Coffee-AHK`中`is`相当于`==`，`isnt`相当于`！=`。

`Coffee-AHK` compiles `is` compiles into `==`, and `isnt` into `!=`.

`not`相当于`！`的别名。

You can use `not` as an alias for `!`.

`and`相当于`&&`，`or`相当于`||`。

For logic, `and` compiles to `&&`, and `or` into `||`.

在`while`、`if`/`else`和`switch`/`when`语句中，`then`可以代替换行或分号，用于分隔表达式中的条件。

Instead of a newline or semicolon, `then` can be used to separate conditions from expressions, in `while`, `if`/`else`, and `switch`/`when` statements.

如同在`YAML`中那样，`on`和`yes`相当于`true`，`off`和`no`则相当于`false`。

As in `YAML`, `on` and `yes` are the same as boolean `true`, while `off` and `no` are boolean `false`.

`unless`可以视作`if not`。

`unless` can be used as the inverse of `if`.

你可以使用`@property`作为`this.property`的缩写。

As a shortcut for `this.property`, you can use `@property`.

为了简化数学表达式，你也可以使用`**`和`//`。

To simplify math expressions, `**` can be used for exponentiation and `//` performs floor division.

总而言之：

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

## 链式调用 Chained Calls

使用行首`.`来更简单地使用链式调用。

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

## 赋值解构 Destructuring Assignment

同`JavaScript`一样，`Coffee-AHK`支持赋值解构。当你将一个数组或对象文字赋值时，`Coffee-AHK`会将两边的值打散并相互匹配，将右边的值赋给左边的变量。这可以用于最简单的交换变量：

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

或是实现非常实用的多返回函数：

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

## 类 Class

由于`AHK`不区分大小写，请不要使用`item = new Item()`这种写法。而应该这么写：`item2 = new Item()`。

Since `AHK` is not case-sensitive, please do not use this way of writing: `item = new Item()`. Instead, it should be written like this: `item2 = new Item()`.

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

import data from './data.json'
import data2 from './data.yaml
```

## 原生AHK

如果你需要在代码中穿插一些原生`AHK`片段，你可以这么做：

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