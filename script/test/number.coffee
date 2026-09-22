# Number literals

# Integer
a = 1
b = 0
c = 42

# Floating point
d = 3.14
e = 0.5
f = .5

# Scientific notation (1e3 → 1000 by CoffeeScript)
g = 1e3
h = 2.5e2

# Large numbers
i = 1000000
j = 999999999

# Note: CoffeeScript converts:
# - 0xFF (hex) → 255
# - 0o77 (octal) → 63
# - 0b1010 (binary) → 10
# These are NOT tested here as conversion happens before transpiler
# BigInt (123n) is FORBIDDEN - see error-forbidden-syntax.coffee

# Exponent edge cases (regression: 0x1e5 hex, 1e-3 negative, 1.5e2 decimal mantissa)
k = 0x1e5
l = 1e-3
m = 1.5e2

# Binary/octal literals (regression: raw 0b/0o is invalid in AHK v1)
n = 0b101
o = 0o17
p = 0x1F
