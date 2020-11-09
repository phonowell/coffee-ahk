global fn := Func("anonymous_5")
fn := Func("anonymous_4")
fn := Func("anonymous_3")
fn := Func("anonymous_2")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("anonymous_1")
anonymous_1(a, b, c) {
  a
  Func(b).Call()
  Func(c).Call(a)
}
anonymous_2(a := 1, b := 2) {
  return a + b
}
anonymous_3(a, b*) {
  return b[1]
}
anonymous_4(a := 1) {
  return a
}
anonymous_5() {
  1
}