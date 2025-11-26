global fn := Func("ahk_13")
fn := Func("ahk_12")
fn := Func("ahk_11")
fn := Func("ahk_10")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("ahk_9")
fn := Func("ahk_8")
(Func("ahk_4")).Call()
ahk_1(__ctx__, a, b) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a + __ctx__.b
}
ahk_2(__ctx__, a) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  return __ctx__.a + __ctx__.b
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.a + __ctx__.b
}
ahk_4(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.fn1 := Func("ahk_3").Bind(__ctx__)
  __ctx__.fn2 := Func("ahk_2").Bind(__ctx__)
  __ctx__.fn3 := Func("ahk_1").Bind(__ctx__)
}
ahk_5(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.a + __ctx__.b + __ctx__.c
}
ahk_6(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.c := 3
  return (Func("ahk_5").Bind(__ctx__)).Call()
}
ahk_7(__ctx__, b := 2) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.b := b
  return (Func("ahk_6").Bind(__ctx__)).Call()
}
ahk_8(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := 1
  return (Func("ahk_7").Bind(__ctx__)).Call()
}
ahk_9(__ctx__, a, b, c) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  __ctx__.c := c
  __ctx__.a
  __ctx__.b.Call()
  __ctx__.c.Call(__ctx__.a)
}
ahk_10(__ctx__, a := 1, b := 2) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a + __ctx__.b
}
ahk_11(__ctx__, a, b*) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.b[2]
}
ahk_12(__ctx__, a := 1) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  return __ctx__.a
}
ahk_13(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 1
}