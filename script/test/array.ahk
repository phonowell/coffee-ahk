global ℓci_ahk := Func("salt_1").Bind({})
salt_1(ℓarr, ℓidx) {
  if ℓidx is Number
    if (ℓidx < 0)
      return ℓarr.Length() + ℓidx + 1
    return ℓidx + 1
  return ℓidx
}
global a := []
a := [1]
a := [1, 2, 3]
a := [1, 2, 3]
a := [1, 2, 3]
a := [1, 2, 3, [1, 2, 3]]
global ℓarray := [1, 2, 3]
a := ℓarray[1]
ℓarray := [1, 2, 3]
a := ℓarray[1]
global b := ℓarray[2]
ℓarray := [1, 2, 3]
a := ℓarray[1]
b := ℓarray[2]
global c := ℓarray[3]
ℓarray := [1, 2, 3]
a["a"] := ℓarray[1]
a.b := ℓarray[2]
a.c := ℓarray[3]
global d := [1, 2, 3][1]
a[ℓci_ahk.Call(a, b[ℓci_ahk.Call(b, c[ℓci_ahk.Call(c, d)])])]
global fn1 := Func("ahk_13").Bind({})
global fn2 := Func("ahk_12").Bind({})
global fn3 := Func("ahk_10").Bind({})
global fn4 := Func("ahk_8").Bind({})
global fn5 := Func("ahk_6").Bind({})
global fn6 := Func("ahk_4").Bind({})
global fn7 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return [λ.x, λ.y, λ.x + λ.y]
}
ahk_2(λ) {
  λ.x := 1
  λ.y := 2
  λ.builder := Func("ahk_1").Bind(λ)
  return λ.builder.Call()
}
ahk_3(λ) {
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.idx)]
}
ahk_4(λ) {
  λ.arr := [10, 20, 30]
  λ.idx := 1
  λ.getter := Func("ahk_3").Bind(λ)
  return λ.getter.Call()
}
ahk_5(λ) {
  ℓarray := [λ.q, λ.p]
  λ.p := ℓarray[1]
  λ.q := ℓarray[2]
}
ahk_6(λ) {
  ℓarray := [1, 2]
  λ.p := ℓarray[1]
  λ.q := ℓarray[2]
  λ.swap := Func("ahk_5").Bind(λ)
  λ.swap.Call()
  return [λ.p, λ.q]
}
ahk_7(λ) {
  return λ.matrix[1][1] := 99
}
ahk_8(λ) {
  λ.matrix := [[1, 2], [3, 4]]
  λ.inner := Func("ahk_7").Bind(λ)
  λ.inner.Call()
  return λ.matrix
}
ahk_9(λ, x) {
  λ.x := x
  return λ.arr.push.Call(λ.x)
}
ahk_10(λ) {
  λ.arr := []
  λ.addItem := Func("ahk_9").Bind(λ)
  λ.addItem.Call(1)
  λ.addItem.Call(2)
  return λ.arr
}
ahk_11(λ) {
  λ.arr[1] := 10
  λ.arr[2] := 20
}
ahk_12(λ) {
  λ.arr := [1, 2, 3]
  λ.modify := Func("ahk_11").Bind(λ)
  λ.modify.Call()
  return λ.arr
}
ahk_13(λ) {
  λ.arr := [1, 2, 3]
  return λ.arr
}