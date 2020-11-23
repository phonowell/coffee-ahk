class T {
  a := Func("ahk_3").Bind(this)
  b := Func("ahk_2").Bind(this)
  c := 0
  d := Func("ahk_1").Bind(this)
}
global t := new T()
ahk_1(this) {
  return this.c
}
ahk_2(this, n) {
  return n
}
ahk_3(this) {
  return 1
}