global fn := Func("ahk_2")
global nested := Func("ahk_1")
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  if (true) {
    __ctx__.x := 1
    __ctx__.y := 2
  }
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := 1
  __ctx__.b := 2
  __ctx__.a + __ctx__.b
}