class T {
  a := Func("ahk_3")
  b := Func("ahk_2")
  c := 0
  d := Func("ahk_1")
}
global t := new T()
ahk_1() {
  return this.c
}
ahk_2(n) {
  return n
}
ahk_3() {
  return 1
}