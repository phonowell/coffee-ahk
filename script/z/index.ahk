global __ahk_module_1__ := (Func("ahk_3")).Call()
global alert := __ahk_module_1__
((Func("ahk_1")).Call()).Call("hello world")
ahk_1() {
  return alert
}
ahk_2(msg) {
  MsgBox, % msg
}
ahk_3() {
  return Func("ahk_2")
}
