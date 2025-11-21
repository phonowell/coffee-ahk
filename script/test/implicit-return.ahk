global fn1 := Func("ahk_4")
global fn2 := Func("ahk_3")
global fn3 := Func("ahk_2").Bind(a, b)
global fn4 := Func("ahk_1")
ahk_1() {
  x := 1
  x + 1
}
ahk_2(a, b) {
  return a + b
}
ahk_3() {
  return "hello"
}
ahk_4() {
  return 42
}