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

global fn1 := Func("ahk_29").Bind({})
global fn2 := Func("ahk_28").Bind({})
global fn3 := Func("ahk_27").Bind({})
global fn4 := Func("ahk_26").Bind({})
global fn5 := Func("ahk_25").Bind({})
global fn6 := Func("ahk_24").Bind({})
global fn7 := Func("ahk_22").Bind({})
global fn8 := Func("ahk_20").Bind({})
global fn9 := Func("ahk_18").Bind({})
global fn10 := Func("ahk_16").Bind({})
global fn11 := Func("ahk_14").Bind({})
global fn12 := Func("ahk_12").Bind({})
global fn13 := Func("ahk_10").Bind({})
global fn14 := Func("ahk_8").Bind({})
global fn15 := Func("ahk_6").Bind({})
global fn16 := Func("ahk_4").Bind({})
global fn17 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.outer
}
ahk_2(λ) {
  λ.outer := "test"
  λ.obj := {method: Func("ahk_1").Bind(λ)}
  return λ.obj.method.Call()
}
ahk_3(λ) {
  return λ.x := 2
}
ahk_4(λ) {
  λ.x := 1
  (Func("ahk_3").Bind(λ)).Call()
  return λ.x
}
ahk_5(λ) {
  return [λ.i, λ.j]
}
ahk_6(λ) {
  λ.results := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    for ℓi, j in [4, 5] {
      λ.j := j
      ℓi := ℓi - 1
      λ.results.push.Call(Func("ahk_5").Bind(λ))
    }
  }
  return λ.results
}
ahk_7(λ) {
  λ.name := "closure"
  return "hello " . (λ.name) . ""
}
ahk_8(λ) {
  λ.name := "world"
  λ.greet := Func("ahk_7").Bind(λ)
  return λ.greet.Call()
}
ahk_9(λ) {
  return λ.arr[ℓci_ahk.Call(λ.arr, -1)]
}
ahk_10(λ) {
  λ.arr := [1, 2, 3]
  λ.inner := Func("ahk_9").Bind(λ)
  return λ.inner.Call()
}
ahk_11(λ) {
  return λ.data.nested.value := 99
}
ahk_12(λ) {
  λ.data := {nested: {value: 1}}
  λ.inner := Func("ahk_11").Bind(λ)
  λ.inner.Call()
  return λ.data.nested.value
}
ahk_13(λ) {
  λ.obj.a := 10
  λ.obj.b := 20
}
ahk_14(λ) {
  λ.obj := {a: 1, b: 2}
  λ.inner := Func("ahk_13").Bind(λ)
  λ.inner.Call()
  return λ.obj
}
ahk_15(λ) {
  λ.arr[1] := 10
  λ.arr[2] := 20
}
ahk_16(λ) {
  λ.arr := [1, 2, 3]
  λ.inner := Func("ahk_15").Bind(λ)
  λ.inner.Call()
  return λ.arr
}
ahk_17(λ) {
  λ.x += 5
  λ.x -= 2
  λ.x *= 2
}
ahk_18(λ) {
  λ.x := 10
  λ.inner := Func("ahk_17").Bind(λ)
  λ.inner.Call()
  return λ.x
}
ahk_19(λ) {
  return λ.a := λ.b := λ.c := 2
}
ahk_20(λ) {
  λ.a := λ.b := λ.c := 1
  λ.inner := Func("ahk_19").Bind(λ)
  λ.inner.Call()
  return λ.a + λ.b + λ.c
}
ahk_21(λ) {
  λ.x := "inner"
  return λ.x
}
ahk_22(λ) {
  λ.x := "outer"
  λ.inner := Func("ahk_21").Bind(λ)
  λ.inner.Call()
  return λ.x
}
ahk_23(λ) {
  return λ.a + λ.b + λ.c + λ.d
}
ahk_24(λ) {
  λ.a := 1
  if (true) {
    λ.b := 2
    if (true) {
      λ.c := 3
      if (true) {
        λ.d := 4
        λ.inner := Func("ahk_23").Bind(λ)
        return λ.inner.Call()
      }
    }
  }
}
ahk_25(λ) {
  λ.x := ""
  return λ.x
}
ahk_26(λ) {
  return
}
ahk_27(λ) {
  return
}
ahk_28(λ) {
  λ.result := 1
  λ.idx := 0
  return λ.result + λ.idx
}
ahk_29(λ) {
  λ.dollar := 1
  λ._underscore := 2
  λ.result := λ.dollar + λ._underscore
  return λ.result
}