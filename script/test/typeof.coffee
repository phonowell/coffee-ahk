# Basic typeof
x = typeof y
z = typeof 123

# Property access
a = typeof obj.prop

# Index access
b = typeof arr[0]

# Function call
c = typeof fn()

# Comparison
d = typeof x == "number"

# Logical expression
e = typeof x == "string" or typeof x == "number"

# Chained property
f = typeof obj.a.b.c

# Nested calls
g = typeof fn().prop

# String literal
h = typeof "hello"

# In function parameter
fn2(typeof x)

# With bitwise NOT (edge case)
i = typeof ~x

# In array
arr2 = [typeof x, typeof y]

# In object value
obj2 = {t: typeof x}

# Chained method call
j = typeof obj.method().result
