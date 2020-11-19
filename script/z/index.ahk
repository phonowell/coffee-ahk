global fn := Func("z_9")
fn := Func("z_8")
fn := Func("z_7")
fn := Func("z_6")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("z_5")
fn := Func("z_4")
z_1(a, b, c) {
  return a + b + c
}
z_2(a, b) {
  c := 3
  return fn3.Call(Func("z_1").Bind(a, b, c))
}
z_3(a) {
  b := 2
  return fn2.Call(Func("z_2").Bind(a, b))
}
z_4() {
  a := 1
  return fn1.Call(Func("z_3").Bind(a))
}
z_5(a, b, c) {
  a
  b.Call()
  c.Call(a)
}
z_6(a := 1, b := 2) {
  return a + b
}
z_7(a, b*) {
  return b[1]
}
z_8(a := 1) {
  return a
}
z_9() {
  1
}
