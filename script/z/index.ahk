
(Func("ahk_2")).Call()
ahk_1(a) {
  a := 2
  return a
}
ahk_2() {
  a := 1
  (Func("ahk_1").Bind(a)).Call()
}
