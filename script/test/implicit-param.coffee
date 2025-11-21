# Implicit parameter test
# 使用未声明的变量会自动添加到参数
fn1 = -> x + y
fn2 = -> a * b + c
fn3 = (a) -> a + b
