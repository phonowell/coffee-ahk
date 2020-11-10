global __ctx_ahk__ := {}
global fn := Func("ahk_9")
fn := Func("ahk_8")
fn := Func("ahk_7")
fn := Func("ahk_6")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("ahk_5")
fn := Func("ahk_4")
ahk_1()
  a := __ctx_ahk__.a
  b := __ctx_ahk__.b
  c := __ctx_ahk__.c {
  return a + b + c
}
ahk_2()
  a := __ctx_ahk__.a
  b := __ctx_ahk__.b {
  c := 3
  __ctx_ahk__.a := a
  __ctx_ahk__.b := b
  __ctx_ahk__.c := c
  return fn3.Call("ahk_1")
}
ahk_3()
  a := __ctx_ahk__.a {
  b := 2
  __ctx_ahk__.a := a
  __ctx_ahk__.b := b
  return fn2.Call("ahk_2")
}
ahk_4() {
  a := 1
  __ctx_ahk__.a := a
  return fn1.Call("ahk_3")
}
ahk_5(a, b, c) {
  a
  Func(b).Call()
  Func(c).Call(a)
}
ahk_6(a := 1, b := 2) {
  return a + b
}
ahk_7(a, b*) {
  return b[1]
}
ahk_8(a := 1) {
  return a
}
ahk_9() {
  1
}