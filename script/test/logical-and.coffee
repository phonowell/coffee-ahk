# Test && operator value-preserving conversion

# Should convert - literal tail operand
a = b && 0
x = y && "yes"
z = w && -1

# Should NOT convert - variables and booleans
p = q && r
flag = x && true

# Chained && keeps value semantics through nested ternaries
deep = u && v && "fallback"

# Inside function
fn = (val) ->
  count = val && 42
  name = val && "test"

  # Should NOT convert
  other = val && fallback

  return {count, name, other}

# Mixed precedence: && binds tighter than ||
m1 = a || b && "c"
m2 = a && b || "c"
m3 = a && b || c
m4 = (a || b) && "c"
m5 = a || (b && "c")

# Value positions beyond assignment
c1 = f(a && "c")
o1 = {k: a && "b"}
n1 = [a || "d", b && "e"]
r1 = -> return a || "c"
