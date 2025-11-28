StringUpper, result, input
StringLower, result, input
global fn1 := Func("ahk_14").Bind({})
global fn2 := Func("ahk_13").Bind({})
global fn3 := Func("ahk_12").Bind({})
global fn4 := Func("ahk_11").Bind({})
global fn5 := Func("ahk_10").Bind({})
global globalVar := "test"
global fn6 := Func("ahk_8").Bind({})
global fn7 := Func("ahk_7").Bind({})
global fn8 := Func("ahk_6").Bind({})
global fn9 := Func("ahk_5").Bind({})
global fn10 := Func("ahk_4").Bind({})
global fn11 := Func("ahk_3").Bind({})
global fn12 := Func("ahk_2").Bind({})
global fn13 := Func("ahk_1").Bind({})
ahk_1(λ) {
  λ.localVar := 1
  
  StringUpper, λ.localVar, λ.localVar
  msgbox, % λ.localVar
  
}
ahk_2(λ) {
  msgbox, % ℓidx
}
ahk_3(λ) {
  λ.result := GetValue()
}
ahk_4(λ) {
  msgbox, % λ.obj.prop
}
ahk_5(λ) {
  
  if (λ.x) {
    return λ.y
  }
  
}
ahk_6(λ) {
  msgbox, % MyClass.value
}
ahk_7(λ) {
  msgbox, % this.name
}
ahk_8(λ) {
  msgbox, % globalVar
}
ahk_9(λ) {
  StringUpper, λ.prefix, λ.prefix
}
ahk_10(λ) {
  λ.prefix := "hello"
  λ.inner := Func("ahk_9").Bind(λ)
  λ.inner.Call()
}
ahk_11(λ) {
  Format, λ.output, {1} + {2} = {3}, λ.a, λ.b, λ.c
}
ahk_12(λ) {
  return % λ.myVar
}
ahk_13(λ) {
  msgbox, % λ.msg
}
ahk_14(λ) {
  StringUpper, λ.$result, λ.ipt
}