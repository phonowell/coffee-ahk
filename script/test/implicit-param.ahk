global fn1 := Func("ahk_3")
global fn2 := Func("ahk_2")
global fn3 := Func("ahk_1")
ahk_1(__ctx__, a) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  return __ctx__.a + __ctx__.b
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.a * __ctx__.b + __ctx__.c
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.x + __ctx__.y
}