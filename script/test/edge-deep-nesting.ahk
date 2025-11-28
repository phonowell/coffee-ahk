global ℓci_ahk := Func("salt_1").Bind({})
salt_1(ℓarr, ℓidx) {
  if ℓidx is Number
    if (ℓidx < 0)
      return ℓarr.Length() + ℓidx + 1
    return ℓidx + 1
  return ℓidx
}

global fn := Func("ahk_6").Bind({})
global result := (Func("ahk_3").Bind({})).Call()
global arr := [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
global obj := {a: {b: {c: {d: 1}}}}
a[ℓci_ahk.Call(a, b[ℓci_ahk.Call(b, c[ℓci_ahk.Call(c, d)])])]
a.b.c.d.e
fn.Call().Call().Call()
ahk_1(λ) {
  return 42
}
ahk_2(λ) {
  return (Func("ahk_1").Bind(λ)).Call()
}
ahk_3(λ) {
  return (Func("ahk_2").Bind(λ)).Call()
}
ahk_4(λ) {
  return 1
}
ahk_5(λ) {
  return Func("ahk_4").Bind(λ)
}
ahk_6(λ) {
  return Func("ahk_5").Bind(λ)
}