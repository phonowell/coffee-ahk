# Nil/empty values

# null → "" (empty string in AHK)
a = null

# undefined → "" (same as null)
b = undefined

# NaN handling (special case)
c = NaN

# Comparison with nil
d = (a == null)
e = (b == undefined)

# Note: AHK v1 has no true null/undefined
# All these become empty string ""
# Use `if var` or `if (var == "")` to check
