setTimeout.Call(Func("ahk_4").Bind(setTimeout), 4000)
ahk_1() {
  return 1
}
ahk_2(setTimeout) {
  return setTimeout.Call(Func("ahk_1"), 1000)
}
ahk_3(setTimeout) {
  return setTimeout.Call(Func("ahk_2").Bind(setTimeout), 2000)
}
ahk_4(setTimeout) {
  return setTimeout.Call(Func("ahk_3").Bind(setTimeout), 3000)
}