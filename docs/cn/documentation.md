# 文档

你可以把`Coffee-AHK`看作是`CoffeeScript`的一种方言，它可以编译为 AutoHotkey v1 脚本。它兼容现有的`AHK`代码，并增加了类、模块、函数式编程、赋值解构、丰富语法糖等现代特性。注意：AutoHotkey 不区分大小写。

安装、选项与完整的特性/限制矩阵见 [README.md](../../README.md)；简明编写指南见 [USAGE.md](../../USAGE.md)。

## 概览

上方为`Coffee-AHK`代码，下方为翻译后的`AHK`代码。生成函数名以 `salt` 为前缀（默认为源码的确定性 hash，如 `s1f8zyy3`）；闭包通过上下文对象 `λ` 持有捕获变量。

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

## 安装

```shell
# install locally for a project:
pnpm install coffee-ahk
```

## 语言参考

首先，`Coffee-AHK`使用有语义的空格和换行。你可以直接通过换行来终止表达式，而不需要显式书写`;`（除非你需要将多个表达式写在同一行）。而在函数、`if`语句、`switch`语句或`try`/`catch`中，你需要使用缩进替代包围代码块的`{}`来划分代码块。

在执行函数时，你不需要显式使用`()`来包裹参数。隐式调用会自动帮你处理好这些。

`console.log sys.inspect object` → `console.log(sys.inspect(object));`

所有以大写字母开头的函数都被视作内置函数，不会被 `Func(...).Call(...)` 包裹。

## 函数

函数由括号中的参数、箭头和函数体三部分构成。一个最简单的空函数长这样：`->`。

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

函数参数可以设置默认值，当参数不传时（即为`undefined`时），其将被置为该值。

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

隐式 return：仅当函数体是单条语句/表达式时自动返回；多语句函数体必须显式书写 `return`。例外：`if`/`else if`/`else` 链作为函数体最后一条语句时，返回被执行分支的最后一个表达式——多语句函数体同样生效，分支末尾的嵌套 `if` 会递归处理。`for`/`while`/`try`/native 函数体不生成隐式 return。

## 字符串

如同`JavaScript`和其他许多语言一样，`Coffee-AHK`同时支持`'`和`"`。`Coffee-AHK`也支持使用`#{ ... }`的形式，在`"`包裹的字符串中进行字符串插值，甚至在对象的键名中你也可以这么做。

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

块字符串（`'''` / `"""`）保留换行为 `` `n ``：

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

双引号包括的块状字符串也可以进行插值。

## 对象与数组

`Coffee-AHK`中的对象与数组看起来同`JavaScript`非常相似。当每个属性都单独成行时，句末的`,`是可以省略的。你也可以使用缩进代替`{}`来创建对象，就像在`YAML`中那样。

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

## 注释

`Coffee-AHK`中使用`#`来表示行注释，使用`###`来表示块注释。

## If, Else, Unless, and Conditional Assignment

`if`/`else`可以不使用`{}`包裹。你可以同其他块状表达式一样，使用缩进来划分它们。

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

`if`/`else` 也可用作表达式：在 `=` 右侧、`return`/`throw` 之后以及括号内会编译为三元运算。缺省 `else` 时结果为 `""`，`else if` 链编译为右结合三元。不支持出现在调用参数、数组、索引括号与对象字面量中（编译错误）——先赋给变量。嵌套 if 表达式同样不支持。

`if`/`else` 链作为函数体最后一条语句时也可充当返回值：各分支末尾会自动注入 `return`，分支末尾的嵌套 `if` 会递归处理。

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

展开调用同为后缀形式——`f(...args)` 编译为 `f.Call(args*)`。仅可展开普通标识符：`f(...a.b)` 报编译错误——先赋给变量。AHK v1 没有 `arguments` 对象与 `eval`，两者均报编译错误（改用剩余参数）。

## 循环

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

注意：`for item, i in array` 中的 `i` 是 0-based（生成的 `i := i - 1` 会把 AHK 的 1-based 循环索引转回来）。不带索引变量的循环使用内部占位符 `ℓi`。

当循环对象时，使用`of`来替代`in`。

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

`until`相当于`while not`，`loop`相当于`while true`。

## 操作符与别名

在`Coffee-AHK`中`is`相当于`==`，`isnt`相当于`!=`。

`not`相当于`!`的别名。

`and`相当于`&&`，`or`相当于`||`。AHK 中这两个运算符返回布尔值 `0`/`1` 而非操作数——因此在 `=` 右侧、链尾为非布尔字面量的 `||`/`&&` 链会改写为保值三元（`x = a || "d"` 等价于 `x := a ? a : "d"`）；其余位置（条件、调用参数、`return`）保留布尔语义。

在`while`、`if`/`else`和`switch`/`when`语句中，`then`可以代替换行或分号，用于分隔表达式中的条件。

如同在`YAML`中那样，`on`和`yes`相当于`true`，`off`和`no`则相当于`false`。

`unless`可以视作`if not`。

你可以使用`@property`作为`this.property`的缩写。

为了简化数学表达式，你也可以使用`**`做幂运算。

整除（`//`、`//=`）与取模（`%`、`%%`）**不支持**——它们与 AHK 注释/变量语法冲突，会直接报编译错误。请改用 `Floor(a / b)` 或 `Mod(a, b)`。

总而言之：

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

## 链式调用

使用行首`.`来更简单地使用链式调用。

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

## 赋值解构

同`JavaScript`一样，`Coffee-AHK`支持赋值解构。当你将一个数组或对象文字赋值时，`Coffee-AHK`会将两边的值打散并相互匹配，将右边的值赋给左边的变量。这可以用于最简单的交换变量：

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

或是实现非常实用的多返回函数：

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

嵌套解构（`[a, [b, c]] = x`）与 `for` 循环解构不支持——请拆分为独立语句。

## 类

由于`AHK`不区分大小写，请不要使用`item = new Item()`这种写法。而应该这么写：`item2 = new Item()`。

类名必须以大写字母开头且至少 2 个字符。生成代码中类标识符内的大写字母会被替换为全角 Unicode 以模拟大小写（`Animal` → `Ａnimal`）。

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

## 禁用字

AHK 内置名（如 `number`、`menu`、`error`）与 `A_` 前缀不能用作变量、参数、`catch`/`for` 变量、解构目标或类名——编译器会报 `forbidden` 错误。完整清单见 `data/forbidden.yaml`。

## 模块

```coffeescript
import './local-file.coffee'
import 'js-shim.ahk' # 经 ./node_modules 解析

import fn from './source/fn'

import data from './data.json'
import data2 from './data.yaml'
```

支持形式：副作用（`import './m'`）、默认（`import m from './m'`）、具名（`import { a, b } from './m'`）与混合。支持 `export default` 与 `export { a, b }`（`export {}` 是合法空操作；重复 `export default` 报编译错误）。不支持 `import * as`、`import { x as y }` 与 `export const`。`import`/`export` 仅文件编译可用——字符串输入中的 `export` 会报错。heredoc 与 `###` 块注释中看似 import/export 的行会被忽略。

类不能被导出——模块会被包裹以隔离作用域，而 AHK 类必须位于顶层。请在单独文件中定义类，再用副作用导入引入。

## 原生代码

如果你需要在代码中穿插一些原生`AHK`片段，你可以这么做：

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

函数内的原生块通过临时变量桥接闭包变量（如上 `λ_msg`）：块前拷出、块后写回，使 `MsgBox`/`Sort` 等老式 AHK 命令可以操作这些变量。
