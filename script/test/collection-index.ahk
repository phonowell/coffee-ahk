global ℓci_ahk := Func("salt_1")
salt_1(ℓarr, ℓidx) {
  if ℓidx is Number
    if (ℓidx < 0)
      return ℓarr.Length() + ℓidx + 1
    return ℓidx + 1
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