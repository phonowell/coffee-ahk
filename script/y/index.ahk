global __ctx_ahk__ := {}
global fn := {}
fn.a := Func("ahk_2")
global main := Func("ahk_1")
ahk_1(fn) {
  fn.a.Call("1")
}
ahk_2(key) {
  $.press.Call(key)
}
