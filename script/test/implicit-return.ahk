global fn1 := Func("ahk_4")
global fn2 := Func("ahk_3")
global fn3 := Func("ahk_2")
global fn4 := Func("ahk_1")
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.x := 1
  __ctx__.x + 1
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.a + __ctx__.b
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return "hello"
}
ahk_4(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 42
}