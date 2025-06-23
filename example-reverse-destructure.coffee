# 演示反向解构赋值功能
# Demo: Reverse destructuring assignment feature

# 基本用法 - Basic usage
points = 100
score = { points }
# 编译后: score := {points: points}

# 多个变量 - Multiple variables
x = 10
y = 20
z = 30
coordinate = { x, y, z }
# 编译后: coordinate := {x: x, y: y, z: z}

# 与普通对象语法混合 - Mixed with regular object syntax
name = 'Player1'
level = 5
player = { name, level, health: 100 }
# 编译后: player := {name: name, level: level, health: 100}
