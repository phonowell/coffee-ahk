# coffee-ahk 使用指南

> AI Agent：CoffeeScript → AHK v1 编写指南

```bash
pnpm build
node -e "import('./dist/index.js').then(m => m.default('/path/to/file.coffee', { salt: 'ahk' }).then(console.log))"
```

## 约束

**AHK v1**：大小写不敏感·数组索引从1开始·数组/对象本质相同`{1:a,2:b}`

**禁止语法**（编译报错）：
- `?.` / `?` 可选链·`[1..10]` 范围·`return x if y` 后置if·`x in [1,2]` 关系in·`>>>`/`await`/`yield`
- 后置 `for`/`while`/`until`/`loop`·循环推导式 `x = (v*2 for v in list)`·`for` 修饰符 `when`/`by`/`own`·`try`/`switch` 表达式位·regex 字面量 `///`·`debugger`·`arguments`/`eval`·`f(...a.b)` 成员展开·字符串输入中的 `export`
- `%` / `%%` 取模运算符→用 `Mod(a, b)` (AHK变量语法冲突)

## 语法

### 函数

```coffee
fn = (a, b) -> a + b                # 基本
fn = (a = 1) -> a                   # 默认参数
fn = (first, rest...) -> rest[0]    # 剩余参数
do -> x = 1                         # IIFE

# 隐式return：仅单语句函数体生效
fn = -> x + 1                       # ✅
fn = -> x = 1; y = 2; return x + y  # ✅ 多语句须显式return
fn = -> if a then b else c          # ✅ 例外：函数尾部if链逐分支注入return
```

### 控制流

```coffee
if x > 1 then doSth()               # 单行if
x = if a then b else c              # if表达式→三元：`=`右侧/`return`后/括号内可用；调用参数·数组·对象值内禁用
unless done then continue()
for item in [1, 2, 3]               # for...in
for item, i in array                # 带索引
for key, val of object              # for...of
while count < 10
  count++
switch val
  when 1 then "one"
  else "other"
```

### 类

```coffee
class Animal
  constructor: (name) -> @name = name
  speak: -> "#{@name} says hello"

class Dog extends Animal
  constructor: (name, breed) -> super(name); @breed = breed
  speak: -> "#{super.speak()}, woof!"
```

**⚠️ 类名禁止单字母**：
```coffee
class A            # ❌ 单字母类名在 AHK v1 中有问题
class Bb           # ✅ 至少两个字符
```

### 模块

```coffee
# 导入
import './animal'                       # 副作用（class必用）
import plus from './math'               # 默认
import { add, sub } from './utils'      # 命名
import math, { PI } from './math'       # 混合
# 不支持：import * as / import { x as y }

# 导出
export default (a, b) -> a + b          # 单行
export { plus, minus }                  # 命名
export { foo: bar() }                   # 键值对
# 不支持：export const / export * from / export function
# ⚠️ class文件不能export，用副作用导入
```

### 其他

```coffee
# 字符串
str = "Hello, #{name}!"         # 插值
str = """multiline #{x}"""      # 多行插值

# 操作符
1 < x < 10                      # 链式比较
obj instanceof ClassName        # instanceof
conf = port || "localhost"      # ||/&& 仅 `=` 右侧+链尾字面量→三元保值；其他位置返回 0/1

# 索引
arr[0]      # → arr[1] (自动+1)
arr[-1]     # 最后元素
obj["0"]    # 字符串键不转换
```

## 限制

### 隐式return

仅当函数体是**单条语句/表达式**时生效；多语句函数体一律需显式 `return`。
例外：`if`/`else if`/`else` 链作为函数体**最后一条语句**时，各分支末尾自动注入 `return`（多语句体同样生效，分支末尾的嵌套 `if` 递归处理）。

```coffee
# ✅ 单语句
fn = -> x + 1
fn = -> a: 1
fn = -> {a: 1, b: 2}
fn = -> if a then b else c          # ✅ 尾部if链

# ❌ 多语句无隐式return（结果丢弃）
fn = -> x = 1; y = 2; x + y
fn = ->
  x = 1
  x + 1

# ❌ 无括号多行对象 → 产出损坏，须用带括号显式return
fn = ->
  a: 1
  b: 2

# ✅ 显式return
fn = -> x = 1; y = 2; return x + y
fn = -> return {a: 1, b: 2, c: 3}
```

`for`/`while`/`try`/native 函数体不生成隐式 return。

### 解构/Class

```coffee
# ❌ for解构 → ✅ 分步
for pair in pairs
  [a, b] = pair

# ❌ 嵌套解构 → ✅ 展开
[a, inner] = nested
[b, c] = inner

# ❌ export class → ✅ 分离文件
# animal.coffee: class Animal
# main.coffee: import './animal'

# ❌ 对象禁用数字键
obj[0]     # 禁止
obj["key"] # ✅ 仅用字符串键
```

## 闭包/调试

**闭包**：自动处理引用，循环捕获变量用 `do (i) -> fns.push -> i`

**⚠️ 嵌套闭包参数冲突**：
```coffee
# ❌ 同名参数共享 λ 对象存储
outer = (args...) ->
  inner = (args...) -> console.log args...  # args 被覆盖
  inner(1, 2)    # 打印 1, 2
  args[0]        # BUG: 读到 1 而非外层参数

# ✅ 使用不同参数名
outer = (argsOuter...) ->
  inner = (argsInner...) -> console.log argsInner...
  inner(1, 2)
  argsOuter[0]   # 正确读取外层参数
```
编译器会检测冲突并报错，要求使用独特名称。

**调试**：
```bash
node -e "import('./dist/index.js').then(m => m.default('/tmp/test.coffee', { salt: 'test' }).then(console.log))"
```

## 示例

```coffee
# utils.coffee
add = (a, b) -> a + b
export { add }

# counter.coffee（class不export）
class Counter
  constructor: (initial = 0) -> @value = initial
  increment: -> @value++; return this

# main.coffee
import './counter'
import { add } from './utils'
result = add(new Counter(10).increment().increment().value, 5)  # 17
```
