setTimeout.Call(Func("ahk_4"), 4000)
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 1
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.setTimeout.Call(Func("ahk_1").Bind(__ctx__), 1000)
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.setTimeout.Call(Func("ahk_2").Bind(__ctx__), 2000)
}
ahk_4(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return __ctx__.setTimeout.Call(Func("ahk_3").Bind(__ctx__), 3000)
}