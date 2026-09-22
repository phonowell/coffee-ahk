global ℓci_ahk := Func("ahk_ci").Bind({})
ahk_ci(λ, ℓarr, ℓidx) {
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
global fn1 := Func("ahk_14").Bind({})
global fn2 := Func("ahk_13").Bind({})
global fn3 := Func("ahk_11").Bind({})
global fn4 := Func("ahk_9").Bind({})
global fn5 := Func("ahk_7").Bind({})
global fn6 := Func("ahk_5").Bind({})
global fn7 := Func("ahk_3").Bind({})
global v1 := getItems.Call()[1]
global v2 := getItems.Call()[ℓci_ahk.Call(getItems.Call(), -1)]
global v3 := getItems.Call()[ℓci_ahk.Call(getItems.Call(), i)]
global v4 := obj.method.Call()[ℓci_ahk.Call(obj.method.Call(), k)]
global v5 := (a + b)[ℓci_ahk.Call((a + b), i)]
global fn9 := Func("ahk_1").Bind({})
ahk_1(λ) {
  λ.i := 0
  return this.items[ℓci_ahk.Call(this.items, λ.i)]
}
ahk_2(λ) {
  return λ.data[ℓci_ahk.Call(λ.data, λ.idx)]
}
ahk_3(λ) {
  λ.data := [100, 200, 300]
  λ.idx := 1
  λ.reader := Func("ahk_2").Bind(λ)
  return λ.reader.Call()
}
ahk_4(λ) {
  return λ.obj[ℓci_ahk.Call(λ.obj, λ.key)]
}
ahk_5(λ) {
  λ.obj := {a: 1, b: 2}
  λ.key := "a"
  λ.getter := Func("ahk_4").Bind(λ)
  return λ.getter.Call()
}
ahk_6(λ) {
  return λ.matrix[1][2]
}
ahk_7(λ) {
  λ.matrix := [[1, 2], [3, 4]]
  λ.inner := Func("ahk_6").Bind(λ)
  return λ.inner.Call()
}
ahk_8(λ, base) {
  λ.base := base
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.base + λ.offset)]
}
ahk_9(λ) {
  λ.arr := [10, 20, 30, 40]
  λ.offset := 1
  λ.getAt := Func("ahk_8").Bind(λ)
  return λ.getAt.Call(1)
}
ahk_10(λ, i, v) {
  λ.i := i
  λ.v := v
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.i)] := λ.v
}
ahk_11(λ) {
  λ.arr := [1, 2, 3]
  λ.setter := Func("ahk_10").Bind(λ)
  λ.setter.Call(0, 99)
  return λ.arr
}
ahk_12(λ) {
  return λ.arr[ℓci_ahk.Call(λ.arr, λ.idx)]
}
ahk_13(λ) {
  λ.arr := [1, 2, 3, 4, 5]
  λ.idx := 2
  λ.getter := Func("ahk_12").Bind(λ)
  return λ.getter.Call()
}
ahk_14(λ) {
  λ.arr := [10, 20, 30]
  return λ.arr[2]
}