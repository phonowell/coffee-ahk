global __ahk_module_2__ := (Func("ahk_3")).Call()
global __ahk_module_1__ := (Func("ahk_1")).Call()
global m := __ahk_module_1__
m.alert.Call(1)
ahk_1() {
  alert := __ahk_module_2__
  return {alert: alert}
}
ahk_2(msg) {
  MsgBox, % msg
}
ahk_3() {
  return Func("ahk_2")
}
