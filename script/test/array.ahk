__ci_ahk__ := Func("ahk_1")
global a := []
a := [1]
a := [1, 2, 3]
a := [1, 2, 3]
a := [1, 2, 3]
a := [1, 2, 3, [1, 2, 3]]
global __array__ := [1, 2, 3]
a := __array__[1]
__array__ := [1, 2, 3]
a := __array__[1]
global b := __array__[2]
__array__ := [1, 2, 3]
a := __array__[1]
b := __array__[2]
global c := __array__[3]
global d := [1, 2, 3][1]
a[__ci_ahk__.Call(b[__ci_ahk__.Call(c[__ci_ahk__.Call(d)])])]
ahk_1(input) {
  if input is Number
    return input + 1
  return input
}