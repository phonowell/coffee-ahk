# Basic chained comparison
x = 1 < y < 10

# With variables
result = a <= b <= c

# Mixed operators
check = 0 < x <= 100

# In condition
if 1 < n < 10
  valid()

# Operand with property access
res2 = a < b.c < d

# Compares separated by call arguments are not a chain
callFn(a < b, c < d)

# Operand is a call expression
res3 = a < getV(p, q) < b

# Operand with arithmetic
res4 = a < b + 1 < c
