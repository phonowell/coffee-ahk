setTimeout.Call(Func("ahk_4").Bind(setTimeout), 4000)
ahk_1() {
  1
}
ahk_2(setTimeout) {
  setTimeout.Call(Func("ahk_1"), 1000)
}
ahk_3(setTimeout) {
  setTimeout.Call(Func("ahk_2").Bind(setTimeout), 2000)
}
ahk_4(setTimeout) {
  setTimeout.Call(Func("ahk_3").Bind(setTimeout), 3000)
}
