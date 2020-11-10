global __ctx_anonymous__ := {}
global fn := Func("anonymous_9")
fn := Func("anonymous_8")
fn := Func("anonymous_7")
fn := Func("anonymous_6")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("anonymous_5")
fn := Func("anonymous_4")
anonymous_1()
  a := __ctx_anonymous__.a
  b := __ctx_anonymous__.b
  c := __ctx_anonymous__.c {
  return a + b + c
}
anonymous_2()
  a := __ctx_anonymous__.a
  b := __ctx_anonymous__.b {
  c := 3
  __ctx_anonymous__.a := a
  __ctx_anonymous__.b := b
  __ctx_anonymous__.c := c
  return fn3.Call("anonymous_1")
}
anonymous_3()
  a := __ctx_anonymous__.a {
  b := 2
  __ctx_anonymous__.a := a
  __ctx_anonymous__.b := b
  return fn2.Call("anonymous_2")
}
anonymous_4() {
  a := 1
  __ctx_anonymous__.a := a
  return fn1.Call("anonymous_3")
}
anonymous_5(a, b, c) {
  a
  Func(b).Call()
  Func(c).Call(a)
}
anonymous_6(a := 1, b := 2) {
  return a + b
}
anonymous_7(a, b*) {
  return b[1]
}
anonymous_8(a := 1) {
  return a
}
anonymous_9() {
  1
}
