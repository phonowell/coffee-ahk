# Spread → AHK variadic `*` (postfix)

# prefix spread in a call: f(...args) → f.Call(args*)
collect = (list) -> sum(...list)
mixed = (head, rest) -> merge(head, ...rest)

# postfix spread in a call: f(args...) → f.Call(args*)
postfix = (list) -> sum(list...)

# variadic parameter stays postfix
gather = (first, rest...) -> rest.length
onlyRest = (args...) -> args
