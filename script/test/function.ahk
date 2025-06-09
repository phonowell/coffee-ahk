global fn := Func("ahk_13")
fn := Func("ahk_12")
fn := Func("ahk_11")
fn := Func("ahk_10")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("ahk_9")
fn := Func("ahk_8")
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
ahk_6(a, b) {
  c := 3
  return (Func("ahk_5").Bind(a, b, c)).Call()
}
ahk_7(a, b := 2) {
  return (Func("ahk_6").Bind(a, b)).Call()
}
ahk_8() {
  a := 1
  return (Func("ahk_7").Bind(a)).Call()
}
ahk_9(a, b, c) {
  a
  b.Call()
  c.Call(a)
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