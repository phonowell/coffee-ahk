
global a := Func("ahk_2")
ahk_1() {
  return 2
}
ahk_2() {
  return (Func("ahk_1")).Call()
}
