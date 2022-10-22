global __rf_ahk__ := Func("ahk_14")
global fn := Func("ahk_13")
fn := Func("ahk_12")
fn := Func("ahk_11")
fn := Func("ahk_10")
__rf_ahk__.Call(fn, "#rf/ahk/1").Call(1, 2)
__rf_ahk__.Call(fn, "#rf/ahk/2").Call(__rf_ahk__.Call(fn, "#rf/ahk/3").Call(fn))
fn := Func("ahk_9")
fn := Func("ahk_8").Bind(fn1, fn2, fn3)
(Func("ahk_4")).Call()
ahk_1(a, b) {
  return a + b
}
ahk_2(b, a) {
  return a + b
}
ahk_3(a, b) {
  return a + b
}
ahk_4() {
  fn1 := Func("ahk_3").Bind(a, b)
  fn2 := Func("ahk_2").Bind(b)
  fn3 := Func("ahk_1")
}
ahk_5(a, b, c) {
  return a + b + c
}
ahk_6(fn3, a, b) {
  c := 3
  return __rf_ahk__.Call(fn3, "#rf/ahk/4").Call(Func("ahk_5").Bind(a, b, c))
}
ahk_7(fn2, fn3, a) {
  b := 2
  return __rf_ahk__.Call(fn2, "#rf/ahk/5").Call(Func("ahk_6").Bind(fn3, a, b))
}
ahk_8(fn1, fn2, fn3) {
  a := 1
  return __rf_ahk__.Call(fn1, "#rf/ahk/6").Call(Func("ahk_7").Bind(fn2, fn3, a))
}
ahk_9(a, b, c) {
  a
  __rf_ahk__.Call(b, "#rf/ahk/7").Call()
  __rf_ahk__.Call(c, "#rf/ahk/8").Call(a)
}
ahk_10(a := 1, b := 2) {
  return a + b
}
ahk_11(a, b*) {
  return b[2]
}
ahk_12(a := 1) {
  return a
}
ahk_13() {
  return 1
}
ahk_14(__fn__, __token__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__token__) . "")
}