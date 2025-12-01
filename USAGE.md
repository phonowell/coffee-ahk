# coffee-ahk 使用指南

> 面向 AI Agent 的 CoffeeScript → AHK v1 编写指南

## 快速开始

```bash
# 转译单个文件
pnpm build
node -e "require('./dist/index.js').default('/path/to/file.coffee', { salt: 'ahk' }).then(console.log)"
```

## 核心约束

### AHK v1 特性

| 特性      | 说明                                      |
| --------- | ----------------------------------------- |
| 大小写    | **不敏感**，`Foo` 和 `foo` 是同一个变量   |
| 数组索引  | **从 1 开始**，`arr[0]` 自动转为 `arr[1]` |
| 数组/对象 | 本质相同，`[a,b]` 等同于 `{1:a, 2:b}`     |

### 禁止语法

以下语法会导致转译错误：

```coffee
# ❌ 可选链（AHK 无等价语法）
x?.y

# ❌ 存在检查操作符
x?

# ❌ 范围操作符
[1..10]

# ❌ 后置 if（用 if...then 替代）
return 1 if condition   # ❌
if condition then 1     # ✅

# ❌ 关系操作符 in（只支持 for...in）
x in [1, 2, 3]          # ❌
for x in [1, 2, 3]      # ✅

# ❌ 无符号右移（AHK 不支持）
x >>> 2

# ❌ async/await（AHK 无异步）
await fetch()

# ❌ yield/生成器（AHK 不支持）
yield value
```

## 语法参考

### 变量与赋值

```coffee
# 基本赋值
x = 1
name = "Alice"

# 数组
arr = [1, 2, 3]
arr = [
  1
  2
  3
]

# 对象
obj = {a: 1, b: 2}
obj =
  a: 1
  b: 2

# 解构赋值
[a, b] = [1, 2]
{name, age} = person
```

### 函数

```coffee
# 无参数
fn = -> 1

# 有参数
fn = (a, b) -> a + b

# 默认参数
fn = (a = 1) -> a

# 剩余参数
fn = (first, rest...) -> rest[0]

# 多行函数
fn = (a, b) ->
  result = a + b
  return result

# 立即执行
do ->
  x = 1
  x + 1
```

### 箭头函数与 this

```coffee
# 箭头函数保留外层 this
class Button
  constructor: ->
    @clicked = false

  onClick: ->
    # do => 内部可以访问 @（this）
    do => @clicked = true
```

### 条件语句

```coffee
# if/else
if x > 1
  doSomething()
else if x < 0
  doOther()
else
  doDefault()

# 单行 if（用 then）
if x > 1 then doSomething()
if x > 1 then a else b

# unless（if not 的语法糖）
unless done
  continue()
```

### 循环

```coffee
# for...in（遍历数组）
for item in [1, 2, 3]
  console.log item

# 带索引
for item, index in array
  console.log index, item

# for...of（遍历对象）
for key, value of object
  console.log key, value

# while
while count < 10
  count++

# break/continue
for x in items
  if x == skip
    continue
  if x == target
    break
```

### Switch

```coffee
switch value
  when 1 then "one"
  when 2, 3 then "two or three"
  else "other"

# 多行
switch value
  when 1
    doOne()
  when 2
    doTwo()
  else
    doDefault()
```

### 异常处理

```coffee
try
  riskyOperation()
catch e
  handleError(e)
finally
  cleanup()

# 单行
try dangerous() catch e then recover()
```

### 类

```coffee
class Animal
  # 属性
  name: ""
  age: 0

  # 构造函数
  constructor: (name, age) ->
    @name = name
    @age = age

  # 方法
  speak: ->
    "#{@name} says hello"

# 继承
class Dog extends Animal
  constructor: (name, age, breed) ->
    super(name, age)
    @breed = breed

  speak: ->
    "#{super.speak()}, woof!"

# 实例化
dog = new Dog("Rex", 3, "German Shepherd")
```

### 模块

```coffee
# 副作用导入（class 文件必须用这种方式）
import './animal'

# 默认导入
import plus from './math'

# 命名导入
import { add, subtract } from './utils'

# 混合导入
import math, { PI } from './math'
```

**重要**：包含 class 的文件不能使用 export，必须用副作用导入。

### 字符串

```coffee
# 单引号（无插值）
str = 'hello world'

# 双引号（支持插值）
str = "Hello, #{name}!"

# 多行字符串
str = '''
  line 1
  line 2
'''

# 多行带插值
str = """
  Hello #{name},
  Welcome!
"""
```

### 操作符

```coffee
# 比较
x == y    # 等于
x != y    # 不等于
x < y     # 小于
x > y     # 大于
x <= y    # 小于等于
x >= y    # 大于等于

# 逻辑
a and b   # 与
a or b    # 或
not a     # 非

# 数学
a + b     # 加
a - b     # 减
a * b     # 乘
a / b     # 除
a % b     # 取模（注意：AHK 用 Mod()）
a ** b    # 幂

# 位运算
a & b     # 按位与
a | b     # 按位或
a ^ b     # 按位异或
~a        # 按位取反
a << b    # 左移
a >> b    # 右移（有符号）

# 链式比较
1 < x < 10    # 等同于 1 < x and x < 10

# instanceof
obj instanceof ClassName
```

### 数组索引

```coffee
# 正索引（自动 +1）
arr[0]   # → arr[1] in AHK
arr[1]   # → arr[2] in AHK

# 负索引（从末尾）
arr[-1]  # 最后一个元素
arr[-2]  # 倒数第二个

# 字符串键不转换
obj["key"]  # 保持不变
obj.key     # 保持不变
```

## 已知限制与解决方案

### for 循环解构不支持

```coffee
# ❌ 不支持
for [a, b] in pairs
  console.log a, b

# ✅ 解决方案
for pair in pairs
  [a, b] = pair
  console.log a, b
```

### 嵌套解构不支持

```coffee
# ❌ 不支持
[a, [b, c]] = nested

# ✅ 解决方案
[a, inner] = nested
[b, c] = inner
```

### Class 与 Export 冲突

```coffee
# ❌ class 文件不能 export
# animal.coffee
export class Animal  # 错误！

# ✅ 分离文件
# animal.coffee（不用 export）
class Animal
  ...

# main.coffee（副作用导入）
import './animal'
dog = new Animal()
```

### 对象的数字键

```coffee
# 注意：obj[0] 会被转换为 obj[1]
# 如果确实需要字符串 "0" 作为键：
obj["0"]  # 不转换
```

## 闭包最佳实践

内层函数修改外层变量时，coffee-ahk 自动处理闭包引用：

```coffee
# ✅ 正常工作
makeCounter = ->
  count = 0
  return ->
    count++
    return count

# ✅ 循环中捕获变量
fns = []
for i in [1, 2, 3]
  do (i) ->        # 用 do 创建独立作用域
    fns.push -> i
```

## 调试技巧

```bash
# 查看转译输出
node -e "require('./dist/index.js').default('/tmp/test.coffee', { salt: 'test' }).then(console.log)"

# 启用调试信息
DEBUG_COFFEE=1 node -e "require('./dist/index.js').default('/tmp/test.coffee', { salt: 'test' }).then(console.log)"
```

## 完整示例

```coffee
# utils.coffee
add = (a, b) -> a + b

multiply = (a, b) -> a * b

factorial = (n) ->
  if n <= 1 then 1 else n * factorial(n - 1)

export { add, multiply, factorial }
```

```coffee
# counter.coffee
class Counter
  constructor: (initial = 0) ->
    @value = initial

  increment: ->
    @value++
    this

  decrement: ->
    @value--
    this

  getValue: ->
    @value

# 不用 export，其他文件用 import './counter'
```

```coffee
# main.coffee
import './counter'
import { add } from './utils'

counter = new Counter(10)
counter.increment().increment()
result = add(counter.getValue(), 5)
# result = 17
```
