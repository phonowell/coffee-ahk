__ci_ahk__ := Func("ahk_1")
a := []
a := [1]
a := [1, 2, 3]
a := [1, 2, 3]
a := [1, 2, 3]
a := [1, 2, 3, [1, 2, 3]]
__array__ := [1, 2, 3]
a := __array__[1]
__array__ := [1, 2, 3]
a := __array__[1]
b := __array__[2]
__array__ := [1, 2, 3]
a := __array__[1]
b := __array__[2]
c := __array__[3]
__array__ := [1, 2, 3]
a["a"] := __array__[1]
a.b := __array__[2]
a.c := __array__[3]
d := [1, 2, 3][1]
a[__ci_ahk__.Call(b[__ci_ahk__.Call(c[__ci_ahk__.Call(d)])])]
ahk_1(input) {
  if input is Number
    return input + 1
  return input
}
