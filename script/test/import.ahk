(Func("ahk_7")).Call()
global __ahk_module_1__ := (Func("ahk_5")).Call()
global __ahk_module_2__ := (Func("ahk_3")).Call()
global plus := __ahk_module_1__.default
global m := __ahk_module_2__.default
global minus := __ahk_module_2__.minus
ahk_1(a, b) {
  return a - b
}
ahk_2(a, b) {
  return a + b
}
ahk_3() {
  plus := Func("ahk_2")
  minus := Func("ahk_1")
  return {default: {plus: plus, minus: minus}, plus: plus, minus: minus}
}
ahk_4(a, b) {
  return a + b
}
ahk_5() {
  return {default: Func("ahk_4")}
}
ahk_6(a, b) {
  return a + b
}
ahk_7() {
  add := Func("ahk_6")
  lodash := {add: add}
}