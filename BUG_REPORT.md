Issue 标题

Object property assignment with variable keys fails in for...of loops

问题描述

When assigning object properties using variable keys inside a for...of loop, the
assignment silently fails. The object remains empty after the loop completes.

重现步骤

CoffeeScript 源代码：

# Test object cloning by copying properties

source = {a: 1, b: 2, c: 3}
target = {}

for key, value of source
target[key] = value

# Result: target is empty {} instead of {a: 1, b: 2, c: 3}

编译后的 AHK 代码：
source := {a: 1, b: 2, c: 3}
target := {}

for key, value in source {
target[__ci_shell__.Call(target, key)] := value
}

; Result: target is empty

完整测试代码：

# test.coffee

obj = {}
for key, value of {a: 1, b: 2}
obj[key] = value

Native 'MsgBox, % "a=" . obj.a . ", b=" . obj.b'

# Shows: "a=, b=" (empty values)

根本原因

AutoHotkey v1 不支持在赋值语句左侧使用函数调用作为索引：

; This works:
obj["a"] := 1

; This FAILS silently:
obj[GetKey("a")] := 1

coffee-ahk 编译器将所有 [] 访问都包装了 **ci_shell** 调用（用于处理负索引和 0-based 转
1-based），但这导致在赋值语句左侧使用函数调用，违反了 AHK v1 的限制。

期望行为

编译器应该区分读取和赋值场景：

读取时（当前正确）：
value := obj[__ci_shell__.Call(obj, key)] ; ✓ 正常工作

赋值时（需要修复）：
; 不应该直接生成：
obj[__ci_shell__.Call(obj, key)] := value ; ✗ 失败

; 应该生成临时变量：
**temp_key := **ci_shell**.Call(obj, key)
obj[**temp_key] := value ; ✓ 正常工作

或者，如果索引是字符串变量（非数字），可以直接使用：
; 检测到 key 来自 for...of（肯定是字符串），直接：
obj[key] := value ; ✓ 字符串键不需要 **ci_shell** 转换

当前 Workaround

使用 Native 直接嵌入 AHK 代码绕过编译器处理：

for key, value of source
Native 'target[key] := value'

影响范围

这个问题影响所有需要在循环中动态赋值对象属性的场景，包括：

- 对象克隆 (clone)
- 对象合并 (mixin, assign)
- 对象转换/映射

环境信息

- coffee-ahk 版本： 0.0.73
- AutoHotkey 版本： v1.x
- 复现项目： shell-ahk (https://github.com/...)

建议的修复方案

1. 短期方案：在文档中明确说明此限制，建议使用 Native 处理对象属性赋值
2. 长期方案：修改编译器，为赋值语句生成临时变量：
   // 伪代码
   if (isAssignment && hasIndexAccess) {
   const tempVar = generateTempVar()
   emit(`${tempVar} := ${indexExpression}`)
   emit(`${target}[${tempVar}] := ${value}`)
   }

附加信息

**ci_shell** 的实现逻辑是正确的（字符串键直接返回），问题仅在于赋值时的语法限制：

salt_1(**arr**, **idx**) {
if **idx** is Number
if (**idx** < 0)
return **arr**.Length() + **idx** + 1
return **idx** + 1
return **idx** ; 字符串直接返回 - 逻辑正确
}
