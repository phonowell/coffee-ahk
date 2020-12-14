a := 1
a := 2
fn := Func("ahk_3")
c := 1
c := 2
fn := Func("ahk_2")
__array__ := [1, 2]
a := __array__[1]
b := __array__[2]
__array__ := [1, 2, 3]
a := __array__[1]
__array__ := list
a := __array__[1]
b := __array__[2]
__array__ := fn.Call()
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
  c := 3
}
ahk_3() {
  b := 1
  b := 2
}