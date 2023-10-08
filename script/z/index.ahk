
(Func("ahk_2")).Call()
ahk_1(a) {
  a := 2
  return a
}
ahk_2() {
  a := 1
  __rf_ahk__.Call((Func("ahk_1").Bind(a)), "#rf/ahk/1").Call()
}
