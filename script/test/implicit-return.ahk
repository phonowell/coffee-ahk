global fn := Func("ahk_3")
ahk_1() {
  return 1
}
ahk_2() {
  return {a: (Func("ahk_1")).Call()}
}
ahk_3() {
  return Func("ahk_2")
}