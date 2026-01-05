# Variable name validation tests
# Tests src/processors/variable/validate.ts

# === Valid variable names ===
myVar = 1
_private = 2
$dollar = 3
someFunction = -> 42

# === Valid function parameters ===
fn1 = (normalParam) -> normalParam + 1
fn2 = (a, b, c) -> a + b + c

# === Valid destructuring ===
[validA, validB] = [1, 2]

# === Valid catch variable ===
try
  x = 1
catch err
  console.log(err)

# === Valid for loop variables ===
for item in [1, 2, 3]
  console.log(item)

for key, value in obj
  console.log(key, value)

# === Valid object keys (non-A_ prefix) ===
config = {
  name: 'test',
  value: 123,
  Index: 'allowed'
}
