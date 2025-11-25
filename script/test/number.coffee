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
