global __rf_ahk__ := Func("ahk_3")
global alert := Func("ahk_2")
global alert2 := Func("ahk_1")
ahk_1() {
  msgbox, % msg
}
ahk_2() {
  msgbox, % msg
}
ahk_3(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}