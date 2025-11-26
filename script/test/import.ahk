(Func("ahk_7")).Call()
global __ahk_module_1__ := (Func("ahk_5")).Call()
global __ahk_module_2__ := (Func("ahk_3")).Call()
global plus := __ahk_module_1__.default
global m := __ahk_module_2__.default
global minus := __ahk_module_2__.minus
ahk_1(__ctx__, a, b) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a - __ctx__.b
}
ahk_2(__ctx__, a, b) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a + __ctx__.b
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  plus := Func("ahk_2").Bind(__ctx__)
  minus := Func("ahk_1").Bind(__ctx__)
  return {default: {plus: plus, minus: minus}, plus: plus, minus: minus}
}
ahk_4(__ctx__, a, b) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a + __ctx__.b
}
ahk_5(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return {default: Func("ahk_4").Bind(__ctx__)}
}
ahk_6(__ctx__, a, b) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.a := a
  __ctx__.b := b
  return __ctx__.a + __ctx__.b
}
ahk_7(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  __ctx__.add := Func("ahk_6").Bind(__ctx__)
  __ctx__.lodash := {add: __ctx__.add}
}