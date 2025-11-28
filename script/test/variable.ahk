global a := 1
a := 2
global fn := Func("ahk_20").Bind({})
global c := 1
c := 2
fn := Func("ahk_19").Bind({})
global ℓarray := [1, 2]
a := ℓarray[1]
global b := ℓarray[2]
ℓarray := [1, 2, 3]
a := ℓarray[1]
ℓarray := list
a := ℓarray[1]
b := ℓarray[2]
ℓarray := fn.Call()
a := ℓarray[1]
b := ℓarray[2]
fn := Func("ahk_18").Bind({})
global fn1 := Func("ahk_17").Bind({})
global fn2 := Func("ahk_15").Bind({})
global fn3 := Func("ahk_13").Bind({})
global fn4 := Func("ahk_10").Bind({})
global fn5 := Func("ahk_8").Bind({})
global fn6 := Func("ahk_6").Bind({})
global fn7 := Func("ahk_4").Bind({})
global fn8 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.arr[1] := 100
}
ahk_2(λ) {
  λ.arr := [1, 2, 3]
  λ.modifier := Func("ahk_1").Bind(λ)
  λ.modifier.Call()
  return λ.arr[1]
}
ahk_3(λ) {
  return λ.x := λ.x * 2
}
ahk_4(λ, x) {
  λ.x := x
  λ.modifier := Func("ahk_3").Bind(λ)
  λ.modifier.Call()
  return λ.x
}
ahk_5(λ) {
  return λ.m := λ.n := λ.o := 9
}
ahk_6(λ) {
  λ.m := λ.n := λ.o := 1
  λ.modifier := Func("ahk_5").Bind(λ)
  λ.modifier.Call()
  return λ.m + λ.n + λ.o
}
ahk_7(λ) {
  λ.count += 1
  λ.count *= 2
}
ahk_8(λ) {
  λ.count := 0
  λ.increment := Func("ahk_7").Bind(λ)
  λ.increment.Call()
  return λ.count
}
ahk_9(λ) {
  return λ.outer := "modified"
}
ahk_10(λ) {
  λ.outer := "outer"
  λ.inner := Func("ahk_9").Bind(λ)
  λ.inner.Call()
  return λ.outer
}
ahk_11(λ) {
  return λ.x := 99
}
ahk_12(λ) {
  λ.level2 := Func("ahk_11").Bind(λ)
  λ.level2.Call()
}
ahk_13(λ) {
  λ.x := 0
  λ.level1 := Func("ahk_12").Bind(λ)
  λ.level1.Call()
  return λ.x
}
ahk_14(λ) {
  λ.p := 10
  λ.q := 20
}
ahk_15(λ) {
  λ.p := 1
  λ.q := 2
  λ.modifier := Func("ahk_14").Bind(λ)
  λ.modifier.Call()
  return λ.p + λ.q
}
ahk_16(λ) {
  return λ.x := 2
}
ahk_17(λ) {
  λ.x := 1
  λ.inner := Func("ahk_16").Bind(λ)
  λ.inner.Call()
  return λ.x
}
ahk_18(λ) {
  ℓarray := [1, 2, 3]
  a := ℓarray[1]
  b := ℓarray[2]
  c := ℓarray[3]
}
ahk_19(λ) {
  return c := 3
}
ahk_20(λ) {
  b := 1
  b := 2
}