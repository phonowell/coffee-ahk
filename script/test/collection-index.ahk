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

a[1]
a[2]
a[11]
a["a"]
a["key"]
a[ℓci_ahk.Call(a, a)]
a[ℓci_ahk.Call(a, idx)]
a[ℓci_ahk.Call(a, 1.1)]
a[ℓci_ahk.Call(a, 3 + 2)]
a[ℓci_ahk.Call(a, a - 1)]
a[ℓci_ahk.Call(a, 1 - a)]
a[ℓci_ahk.Call(a, this.b)]
a[ℓci_ahk.Call(a, this.b - 1)]
a[ℓci_ahk.Call(a, 1 - this.b)]
a["string" . (b) . ""]
a[ℓci_ahk.Call(a, fn.Call())]
a[ℓci_ahk.Call(a, this.fn.Call())]
a[ℓci_ahk.Call(a, b[ℓci_ahk.Call(b, c)])]
a[ℓci_ahk.Call(a, b[ℓci_ahk.Call(b, c[ℓci_ahk.Call(c, d)])])]
arr[1] := 1
arr[2] := 2
arr[ℓci_ahk.Call(arr, i)] := value
arr[ℓci_ahk.Call(arr, idx)] := 999
arr[ℓci_ahk.Call(arr, i + 1)] := x
arr[ℓci_ahk.Call(arr, len - 1)] := y
obj.items[1] := first
obj.items[ℓci_ahk.Call(obj.items, i)] := value
global fn1 := Func("ahk_13").Bind({})
global fn2 := Func("ahk_12").Bind({})
global fn3 := Func("ahk_10").Bind({})
global fn4 := Func("ahk_8").Bind({})
global fn5 := Func("ahk_6").Bind({})
global fn6 := Func("ahk_4").Bind({})
global fn7 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.data[ℓci_ahk.Call(λ.data, λ.idx)]
}
ahk_2(λ) {
  λ.data := [100, 200, 300]
  λ.idx := 1
  λ.reader := Func("ahk_1").Bind(λ)
  return λ.reader.Call()
}
ahk_3(λ) {
  return λ.obj[ℓci_ahk.Call(λ.obj, λ.key)]
}
ahk_4(λ) {
  λ.obj := {a: 1, b: 2}
  λ.key := "a"
  λ.getter := Func("ahk_3").Bind(λ)
  return λ.getter.Call()
}
ahk_5(λ) {
  return λ.matrix[1][2]
}
ahk_6(λ) {
  λ.matrix := [[1, 2], [3, 4]]
  λ.inner := Func("ahk_5").Bind(λ)
  return λ.inner.Call()
}
ahk_7(λ, base) {
  λ.base := base
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.base + λ.offset)]
}
ahk_8(λ) {
  λ.arr := [10, 20, 30, 40]
  λ.offset := 1
  λ.getAt := Func("ahk_7").Bind(λ)
  return λ.getAt.Call(1)
}
ahk_9(λ, i, v) {
  λ.i := i
  λ.v := v
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.i)] := λ.v
}
ahk_10(λ) {
  λ.arr := [1, 2, 3]
  λ.setter := Func("ahk_9").Bind(λ)
  λ.setter.Call(0, 99)
  return λ.arr
}
ahk_11(λ) {
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.idx)]
}
ahk_12(λ) {
  λ.arr := [1, 2, 3, 4, 5]
  λ.idx := 2
  λ.getter := Func("ahk_11").Bind(λ)
  return λ.getter.Call()
}
ahk_13(λ) {
  λ.arr := [10, 20, 30]
  return λ.arr[2]
}