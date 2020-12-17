global fn := Func("ahk_9")
fn := Func("ahk_8")
fn := Func("ahk_7")
fn := Func("ahk_6")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("ahk_5")
fn := Func("ahk_4")
ahk_1(a, b, c) {
  return a + b + c
}
ahk_2(a, b) {
  c := 3
  return fn3.Call(Func("ahk_1").Bind(a, b, c))
}
ahk_3(a) {
  b := 2
  return fn2.Call(Func("ahk_2").Bind(a, b))
}
ahk_4() {
  a := 1
  return fn1.Call(Func("ahk_3").Bind(a))
}
ahk_5(a, b, c) {
  a
  b.Call()
  c.Call(a)
}
ahk_6(a := 1, b := 2) {
  return a + b
}
ahk_7(a, b*) {
  return b[2]
}
ahk_8(a := 1) {
  return a
}
ahk_9() {
  1
}