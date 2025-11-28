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