global a := 1
global b := 2
global c := 3
global fn := Func("ahk_2")
class Ａ {
  m := Func("ahk_1").Bind(this)
}
ahk_1(this) {
  return 1
}
ahk_2() {
  return 1
}