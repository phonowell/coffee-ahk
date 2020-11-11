global __ctx_ahk__ := {}
setTimeout.Call(Func("ahk_4"), 4000)
ahk_1() {
  1
}
ahk_2() {
  setTimeout.Call(Func("ahk_1"), 1000)
}
ahk_3() {
  setTimeout.Call(Func("ahk_2"), 2000)
}
ahk_4() {
  setTimeout.Call(Func("ahk_3"), 3000)
}