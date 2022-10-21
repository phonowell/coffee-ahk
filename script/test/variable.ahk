global __rf_ahk__ := Func("ahk_4")
global a := 1
a := 2
global fn := Func("ahk_3")
global c := 1
c := 2
fn := Func("ahk_2")
global __array__ := [1, 2]
a := __array__[1]
global b := __array__[2]
__array__ := [1, 2, 3]
a := __array__[1]
__array__ := list
a := __array__[1]
b := __array__[2]
__array__ := __rf_ahk__.Call(fn).Call()
a := __array__[1]
b := __array__[2]
fn := Func("ahk_1")
ahk_1() {
  __array__ := [1, 2, 3]
  a := __array__[1]
  b := __array__[2]
  c := __array__[3]
}
ahk_2() {
  return c := 3
}
ahk_3() {
  b := 1
  b := 2
}
ahk_4(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}