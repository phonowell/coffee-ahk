# Math operations: negative numbers and expressions

# Unary negative
a = -1
b = -100

# Binary subtraction
c = 2 - 1
d = 10 - 5 - 2

# Negative in function call
e = fn -1
f = fn(-2)
g = fn a, -3

# Mixed operations
h = -a + b
i = a * -2
j = (-1) + (-2)

# Multiplication and division
k = 2 * 3
l = 10 / 2
m = a * b / c

# Modulo
n = 10 % 3

# Note: hex/octal/binary literals are handled by CoffeeScript
# 0xFF → 255, 0o77 → 63, 0b1010 → 10 (converted before transpiler)
