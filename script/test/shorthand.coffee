# Object shorthand property tests
# Tests src/processors/object/shorthand.ts
# Transforms {a} to {a: a}

# === Basic shorthand ===
a = 1
obj1 = { a }

# === Multiple shorthand properties ===
x = 10
y = 20
z = 30
obj2 = { x, y, z }

# === Mixed shorthand and explicit ===
name = 'test'
value = 42
obj3 = { name, value, extra: 99 }

# === Nested objects ===
inner = { a }
outer = { inner, b: 2 }

# === Shorthand in array ===
arr = [
  { a }
  { x, y }
]

# === Complex nesting ===
config = {
  data: { x, y },
  meta: { name, value }
}
