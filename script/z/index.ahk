global __rf_ahk__ := Func("ahk_5")
global __ahk_module_1__ := (Func("ahk_4")).Call()
global alert := __ahk_module_1__
global act := Func("ahk_2")
(Func("ahk_1")).Call()
ahk_1() {
  return __rf_ahk__.Call(act, "#rf/1").Call(alert, "hello world")
}
ahk_2(callback, args*) {
  return __rf_ahk__.Call(callback, "#rf/2").Call(args*)
}
ahk_3(msg) {
  MsgBox, % msg
}
ahk_4() {
  return Func("ahk_3")
}
ahk_5(__fn__, __n__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__n__) . "")
}
