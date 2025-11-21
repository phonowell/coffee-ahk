# Deep function nesting
fn = -> -> -> 1

# Deep do nesting
result = do -> do -> do -> 42

# Deep array nesting
arr = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]

# Deep object nesting
obj = {
  a: {
    b: {
      c: {
        d: 1
      }
    }
  }
}

# Deep index access
a[b[c[d]]]

# Deep property access
a.b.c.d.e

# Deeply nested call
fn()()()
