global a := b ? c : d
global x := flag ? 1 : 0
global msg := error ? "error" : "ok"
global status := count > 0 ? "有数据" : "无数据"
global fn := Func("ahk_3").Bind({})
global calc := Func("ahk_2").Bind({})
global test := Func("ahk_1").Bind({})
ahk_1(λ) {
  a := λ.flag1 ? "a" : "b"
  λ.b := λ.flag2 ? 10 : 20
  {a: a, b: λ.b}
}
ahk_2(λ, x) {
  λ.x := x
  λ.sign := x > 0 ? 1 : -1
  λ.sign
}
ahk_3(λ) {
  λ.result := λ.condition ? λ.value1 : λ.value2
  λ.result
}