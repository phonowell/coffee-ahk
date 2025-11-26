global ℓci_ahk := Func("salt_1")
salt_1(ℓarr, ℓidx) {
  if ℓidx is Number
    if (ℓidx < 0)
      return ℓarr.Length() + ℓidx + 1
    return ℓidx + 1
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