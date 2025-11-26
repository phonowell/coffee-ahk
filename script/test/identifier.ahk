global foo := 1
global bar := 2
global baz := foo + bar
global myFunc := Func("ahk_1")
global x := y := z := 0
ahk_1(__ctx__, a, b) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a + __ctx__.b
}