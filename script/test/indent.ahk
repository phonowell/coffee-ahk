global fn := Func("ahk_2")
global nested := Func("ahk_1")
ahk_1() {
  if (true) {
    x := 1
    y := 2
  }
}
ahk_2() {
  a := 1
  b := 2
  a + b
}