# Negative indexing (Python-style)
# arr[-1] → arr[arr.Length()]
# arr[-2] → arr[arr.Length() - 1]

arr = [1, 2, 3]

# === READ ACCESS ===
last = arr[-1]
secondLast = arr[-2]
third = arr[-3]

# === WRITE ACCESS ===
arr[-1] = 999
arr[-2] = 888

# With property chain
obj = { items: [1, 2, 3] }
obj.items[-1] = 100

# === CHAINED INDEX (now supported!) ===
nested = [[1, 2], [3, 4]]
val = nested[0][-1]
val2 = nested[1][-2]

# Deep chaining
matrix = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
deep = matrix[0][1][-1]
