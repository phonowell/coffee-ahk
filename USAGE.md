# coffee-ahk 使用指南

> 面向 AI Agent 的 CoffeeScript → AHK v1 编写指南

## 快速开始

```bash
pnpm build
node -e "require('./dist/index.js').default('/path/to/file.coffee', { salt: 'ahk' }).then(console.log)"
```

## 核心约束

### AHK v1 特性

- **大小写不敏感**：`Foo` 和 `foo` 是同一变量
- **数组索引从 1 开始**：`arr[0]` 自动转为 `arr[1]`
- **数组/对象本质相同**：`[a,b]` 等同于 `{1:a, 2:b}`

### 禁止语法

以下语法会导致转译错误：

- `x?.y` / `x?` — 可选链/存在检查
- `[1..10]` — 范围操作符
- `return 1 if condition` — 后置 if（用 `if condition then 1`）
- `x in [1, 2, 3]` — 关系操作符 in（只支持 `for...in`）
- `x >>> 2` / `await` / `yield` — 无符号右移/异步/生成器

## 语法速查

### 变量与解构

```coffee
x = 1
arr = [1, 2, 3]
obj = {a: 1, b: 2}
[a, b] = [1, 2]
{name, age} = person
```

### 函数

```coffee
fn = -> 1                           # 无参数
fn = (a, b) -> a + b                # 有参数
fn = (a = 1) -> a                   # 默认参数
fn = (first, rest...) -> rest[0]    # 剩余参数
do -> x = 1                         # IIFE
```

### 条件与循环

```coffee
if x > 1 then doSomething()         # 单行 if
unless done then continue()         # unless

for item in [1, 2, 3]               # for...in
  console.log item

for item, index in array            # 带索引
for key, value of object            # for...of

while count < 10
  count++

switch value
  when 1 then "one"
  when 2, 3 then "two or three"
  else "other"
```

### 类

```coffee
class Animal
  name: ""
  constructor: (name) -> @name = name
  speak: -> "#{@name} says hello"

class Dog extends Animal
  constructor: (name, breed) ->
    super(name)
    @breed = breed
  speak: -> "#{super.speak()}, woof!"

dog = new Dog("Rex", "German Shepherd")
```

### 模块

#### 导入语法

```coffee
import './animal'                       # 1. 副作用导入（class 文件必须用这种方式）
import plus from './math'               # 2. 默认导入
import { add, subtract } from './utils' # 3. 命名导入
import math, { PI } from './math'       # 4. 混合导入
```

**不支持**：`import * as m` / `import { foo as bar }`

#### 导出语法

```coffee
export default (a, b) -> a + b          # 1. 单行表达式
export default { plus, minus }          # 2. 对象字面量
export { plus, minus }                  # 3. 命名导出
export { foo: bar() }                   # 4. 键值对
export default { plus, minus }          # 5. default + named
export { plus, minus }
```

**不支持**：`export const foo = 1` / `export * from` / `export function fn()`

**重要**：包含 class 的文件不能使用 export，必须用副作用导入。

### 字符串与操作符

```coffee
str = 'hello'                   # 单引号（无插值）
str = "Hello, #{name}!"         # 双引号（插值）
str = '''multiline'''           # 多行字符串
str = """Hello #{name}"""       # 多行带插值

# 比较: == != < > <= >=
# 逻辑: and or not
# 数学: + - * / % **
# 位运算: & | ^ ~ << >>
# 链式比较: 1 < x < 10
# instanceof: obj instanceof ClassName
```

### 数组索引

```coffee
arr[0]      # → arr[1] (自动 +1)
arr[-1]     # 最后一个元素
obj["key"]  # 字符串键不转换
```

## 已知限制

### for 循环解构不支持

```coffee
# ❌ 不支持
for [a, b] in pairs
  console.log a, b

# ✅ 解决方案
for pair in pairs
  [a, b] = pair
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
# 如果需要字符串 "0" 作为键：
obj["0"]  # 不转换
```

## 闭包与调试

### 闭包最佳实践

coffee-ahk 自动处理闭包引用：

```coffee
makeCounter = ->
  count = 0
  return ->
    count++
    return count

# 循环中捕获变量
fns = []
for i in [1, 2, 3]
  do (i) -> fns.push -> i
```

### 调试技巧

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
factorial = (n) -> if n <= 1 then 1 else n * factorial(n - 1)
export { add, multiply, factorial }
```

```coffee
# counter.coffee
class Counter
  constructor: (initial = 0) -> @value = initial
  increment: -> @value++; this
  decrement: -> @value--; this
  getValue: -> @value
# 不用 export，其他文件用 import './counter'
```

```coffee
# main.coffee
import './counter'
import { add } from './utils'

counter = new Counter(10)
counter.increment().increment()
result = add(counter.getValue(), 5)  # result = 17
```
