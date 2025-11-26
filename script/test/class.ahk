class Ａ extends B {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    base.a.Call()
    (Func("ahk_5").Bind(__ctx__)).Call(this)
  }
  d := Func("ahk_4").Bind(this)
  e := Func("ahk_3").Bind(this)
  f := Func("ahk_2").Bind(this)
}
global b := new Ａ()
ahk_1(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return this.a
}
ahk_2(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return (Func("ahk_1").Bind(__ctx__)).Call(this)
}
ahk_3(__ctx__, __this__, n) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  __ctx__.n := n
  return this.a + __ctx__.n
}
ahk_4(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return 1
}
ahk_5(__ctx__, __this__) {
  if (!__ctx__) __ctx__ := {}
  this := __this__
  return this.a
}