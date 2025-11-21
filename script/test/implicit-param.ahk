global fn1 := Func("ahk_3").Bind(x, y)
global fn2 := Func("ahk_2").Bind(a, b, c)
global fn3 := Func("ahk_1").Bind(b)
ahk_1(b, a) {
  return a + b
}
ahk_2(a, b, c) {
  return a * b + c
}
ahk_3(x, y) {
  return x + y
}