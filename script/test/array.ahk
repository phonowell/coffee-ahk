global __ci_ahk__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}
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
__array__ := [1, 2, 3]
a["a"] := __array__[1]
a.b := __array__[2]
a.c := __array__[3]
global d := [1, 2, 3][0]
a[__ci_ahk__.Call(a, b[__ci_ahk__.Call(b, c[__ci_ahk__.Call(c, d)])])]