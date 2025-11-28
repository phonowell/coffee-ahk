global ℓci_ahk := Func("salt_1").Bind({})
salt_1(λ, ℓarr, ℓidx) {
  if ℓidx is Number
  {
    if (ℓidx < 0) {
      return ℓarr.Length() + ℓidx + 1
    }
    return ℓidx + 1
  }
  return ℓidx
}

global arr := [1, 2, 3]
global last := arr[ℓci_ahk.Call(arr, -1)]
global secondLast := arr[ℓci_ahk.Call(arr, -2)]
global third := arr[ℓci_ahk.Call(arr, -3)]
arr[ℓci_ahk.Call(arr, -1)] := 999
arr[ℓci_ahk.Call(arr, -2)] := 888
global obj := {items: [1, 2, 3]}
obj.items[ℓci_ahk.Call(obj.items, -1)] := 100
global nested := [[1, 2], [3, 4]]
global val := nested[1][ℓci_ahk.Call(nested[1], -1)]
global val2 := nested[2][ℓci_ahk.Call(nested[2], -2)]
global matrix := [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
global deep := matrix[1][2][ℓci_ahk.Call(matrix[1][2], -1)]
global fn1 := Func("ahk_11").Bind({})
global fn2 := Func("ahk_10").Bind({})
global fn3 := Func("ahk_8").Bind({})
global fn4 := Func("ahk_6").Bind({})
global fn5 := Func("ahk_4").Bind({})
global fn6 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.first + last
}
ahk_2(λ) {
  arr := [10, 20, 30, 40]
  λ.first := arr[ℓci_ahk.Call(arr, -4)]
  last := arr[ℓci_ahk.Call(arr, -1)]
  λ.calc := Func("ahk_1").Bind(λ)
  return λ.calc.Call()
}
ahk_3(λ) {
  return arr[ℓci_ahk.Call(arr, λ.idx)]
}
ahk_4(λ) {
  arr := [1, 2, 3, 4, 5]
  λ.idx := -2
  λ.getter := Func("ahk_3").Bind(λ)
  return λ.getter.Call()
}
ahk_5(λ) {
  return nested[1][ℓci_ahk.Call(nested[1], -1)]
}
ahk_6(λ) {
  nested := [[1, 2], [3, 4]]
  λ.inner := Func("ahk_5").Bind(λ)
  return λ.inner.Call()
}
ahk_7(λ, v) {
  λ.v := v
  return arr[ℓci_ahk.Call(arr, -1)] := λ.v
}
ahk_8(λ) {
  arr := [1, 2, 3]
  λ.setLast := Func("ahk_7").Bind(λ)
  λ.setLast.Call(99)
  return arr
}
ahk_9(λ) {
  return arr[ℓci_ahk.Call(arr, -1)]
}
ahk_10(λ) {
  arr := [10, 20, 30]
  λ.getLast := Func("ahk_9").Bind(λ)
  return λ.getLast.Call()
}
ahk_11(λ) {
  arr := [1, 2, 3]
  return arr[ℓci_ahk.Call(arr, -1)]
}