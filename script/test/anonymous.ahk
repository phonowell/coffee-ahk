global __ctx_ahk__ := {}
setTimeout.Call("ahk_4", 4000)
ahk_1() {
  1
}
ahk_2() {
  setTimeout.Call("ahk_1", 1000)
}
ahk_3() {
  setTimeout.Call("ahk_2", 2000)
}
ahk_4() {
  setTimeout.Call("ahk_3", 3000)
}