StringUpper, result, input
StringLower, result, input
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_9").Bind({})
global fn5 := Func("ahk_8").Bind({})
global fn6 := Func("ahk_7").Bind({})
global globalVar := "test"
global fn7 := Func("ahk_5").Bind({})
global fn8 := Func("ahk_4").Bind({})
global fn9 := Func("ahk_3").Bind({})
global fn10 := Func("ahk_2").Bind({})
global fn12 := Func("ahk_1").Bind({})
ahk_1(λ) {
  msgbox, % ℓidx
}
ahk_2(λ) {
  λ.obj := {prop: 1}
  λ_obj := λ.obj
  msgbox, % λ_obj.prop
  λ.obj := λ_obj
  }
ahk_3(λ) {
  λ_x := λ.x
  λ_y := λ.y
  if (λ_x) {
    return λ_y
  }
  λ.x := λ_x
  λ.y := λ_y
  }
ahk_4(λ) {
  MsgBox, Hello
  StringUpper, A, B
}
ahk_5(λ) {
  msgbox, % globalVar
}
ahk_6(λ) {
  λ_prefix := λ.prefix
  StringUpper, λ_prefix, λ_prefix
  λ.prefix := λ_prefix
  }
ahk_7(λ) {
  λ.prefix := "hello"
  λ.inner := Func("ahk_6").Bind(λ)
  λ.inner.Call()
  return λ.prefix
}
ahk_8(λ, arr, idx) {
  λ.arr := arr
  λ.idx := idx
  λ_idx := λ.idx
  λ_arr := λ.arr
  if λ_idx is Number
  {
    if (λ_idx < 0) {
      return λ_arr.Length() + λ_idx + 1
    }
    return λ_idx + 1
  }
  λ.idx := λ_idx
  λ.arr := λ_arr
  return λ.idx
}
ahk_9(λ) {
  λ.myVar := "test"
  λ_myVar := λ.myVar
  return %λ_myVar%
  λ.myVar := λ_myVar
  }
ahk_10(λ) {
  λ.msg := "world"
  λ_msg := λ.msg
  msgbox, % λ_msg
  λ.msg := λ_msg
  }
ahk_11(λ) {
  λ.str := "hello"
  λ_str := λ.str
  StringUpper, λ_str, λ_str
  λ.str := λ_str
  return λ.str
}