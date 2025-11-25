# Collection (array/object) index access patterns

# === READ ACCESS ===

# Numeric index (0-based → 1-based conversion)
a[0]
a[1]
a[10]

# String key (no conversion needed)
a['a']
a["key"]

# Variable index (uses __ci__ helper for 0→1 conversion)
a[a]
a[idx]

# Float index
a[1.1]

# Expression index
a[3 + 2]
a[a - 1]
a[1 - a]

# This-property index
a[@b]
a[@b - 1]
a[1 - @b]

# Interpolated string key
a["string#{b}"]

# Function call result as index
a[fn()]
a[@fn()]

# Chained index
a[b[c]]
a[b[c[d]]]

# === WRITE ACCESS (Assignment) ===

# Numeric index assignment
arr[0] = 1
arr[1] = 2

# Variable index assignment (uses __ci__ helper)
arr[i] = value
arr[idx] = 999

# Expression index assignment
arr[i + 1] = x
arr[len - 1] = y

# Property chain assignment
obj.items[0] = first
obj.items[i] = value

# Note: Negative index assignment is in negative-index.coffee
