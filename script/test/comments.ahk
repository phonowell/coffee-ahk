global a := 1
global b := 2
global c := 3
global fn := Func("ahk_2")
class Ａ {
  m := Func("ahk_1").Bind(this)
}
ahk_1(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return 1
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 1
}