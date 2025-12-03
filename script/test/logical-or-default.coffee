# Test || operator default value conversion

# Should convert - literals
a = b || 0
x = y || "default"
z = w || -1

# Should NOT convert - variables and booleans
p = q || r
flag = x || true

# Inside function
fn = (val) ->
  # Should convert
  count = val || 42
  name = val || "test"

  # Should NOT convert
  other = val || fallback

  {count, name, other}
