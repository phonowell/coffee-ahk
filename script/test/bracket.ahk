global ℓci_ahk := Func("salt_1").Bind({})
salt_1(ℓarr, ℓidx) {
  if ℓidx is Number
    if (ℓidx < 0)
      return ℓarr.Length() + ℓidx + 1
    return ℓidx + 1
  return ℓidx
}

global a := (1 + 2) * 3
global b := (a + b) / (c + d)
global c := ((1 + 2) * 3) + 4
fn.Call((x + y))
fn.Call((a + b), (c + d))
global d := ((a))
global e := (((1 + 2)))
if ((a > b) && (c > d)) {
  x := 1
}
arr[ℓci_ahk.Call(arr, (i + 1))]