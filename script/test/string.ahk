global a := "string"
a := "" . (a) . ""
a := "" . (1 - 1) . " === " . (1 - 1) . "?"
a := "line 1 line 2 line 3"
a := "line " . (1) . " line " . (2) . " line " . (3) . ""
a := "<strong>cup of coffee-ahk</strong>"
a := "<strong>cup of " . (name) . "</strong>"
a := "call(""http" . ("s") . """)"
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_8").Bind({})
global fn4 := Func("ahk_6").Bind({})
global fn5 := Func("ahk_4").Bind({})
global fn6 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return "" . (λ.x) . " " . (λ.y) . ""
}
ahk_2(λ) {
  λ.x := "line1"
  λ.y := "line2"
  λ.builder := Func("ahk_1").Bind(λ)
  return λ.builder.Call()
}
ahk_3(λ) {
  return "" . (λ.prefix) . "_middle_" . (λ.suffix) . ""
}
ahk_4(λ) {
  λ.prefix := "pre"
  λ.suffix := "suf"
  λ.builder := Func("ahk_3").Bind(λ)
  return λ.builder.Call()
}
ahk_5(λ) {
  return "" . (λ.x) . " + " . (λ.y) . " = " . (λ.x + λ.y) . ""
}
ahk_6(λ) {
  λ.x := 1
  λ.y := 2
  λ.formatter := Func("ahk_5").Bind(λ)
  return λ.formatter.Call()
}
ahk_7(λ) {
  return λ.text := "modified"
}
ahk_8(λ) {
  λ.text := "initial"
  λ.modifier := Func("ahk_7").Bind(λ)
  λ.modifier.Call()
  return λ.text
}
ahk_9(λ) {
  return "hello " . (λ.name) . ""
}
ahk_10(λ) {
  λ.name := "world"
  λ.greet := Func("ahk_9").Bind(λ)
  return λ.greet.Call()
}
ahk_11(λ) {
  λ.msg := "hello"
  return λ.msg
}