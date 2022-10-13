global __ahk_module_2__ := (Func("ahk_4")).Call()
global __ahk_module_1__ := (Func("ahk_2")).Call()
global m := __ahk_module_1__
m.alert.Call(1)
global fn := Func("ahk_1")
ahk_1() {
  return new N()
}
ahk_2() {
  alert := __ahk_module_2__
  return {alert: alert}
}
ahk_3(msg) {
  MsgBox, % msg
}
ahk_4() {
  return Func("ahk_3")
}
