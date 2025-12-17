(Func("ahk_31").Bind({})).Call()
global fn := Func("ahk_30").Bind({})
(fn).Call()
global a := (Func("ahk_29").Bind({})).Call()
global b := {c: (Func("ahk_28").Bind({})).Call()}
global d := (Func("ahk_27").Bind({})).Call()
(Func("ahk_24").Bind({})).Call()
(Func("ahk_23").Bind({})).Call()
(Func("ahk_22").Bind({})).Call()
(Func("ahk_21").Bind({})).Call()
global fn1 := Func("ahk_20").Bind({})
global fn2 := Func("ahk_18").Bind({})
global fn3 := Func("ahk_15").Bind({})
global fn4 := Func("ahk_12").Bind({})
global fn5 := Func("ahk_9").Bind({})
global fn6 := Func("ahk_7").Bind({})
global fn7 := Func("ahk_5").Bind({})
global fn8 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.m + λ.n
}
ahk_2(λ) {
  λ.m := 1
  λ.n := 2
  λ.result := (Func("ahk_1").Bind(λ)).Call()
  return λ.result
}
ahk_3(λ) {
  return λ.counter += 1
}
ahk_4(λ) {
  λ.counter += 1
  Func("ahk_3").Bind(λ)
}
ahk_5(λ) {
  λ.counter := 0
  λ.increment := (Func("ahk_4").Bind(λ)).Call()
  λ.increment.Call()
  return λ.counter
}
ahk_6(λ) {
  return λ.sum += λ.i
}
ahk_7(λ) {
  λ.sum := 0
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    (Func("ahk_6").Bind(λ)).Call()
  }
  return λ.sum
}
ahk_8(λ) {
  return λ.value := "modified"
}
ahk_9(λ) {
  λ.value := "initial"
  λ.flag := true
  if (λ.flag) {
    (Func("ahk_8").Bind(λ)).Call()
  }
  return λ.value
}
ahk_10(λ) {
  return λ.x
}
ahk_11(λ) {
  return Func("ahk_10").Bind(λ)
}
ahk_12(λ) {
  λ.x := 10
  λ.getter := (Func("ahk_11").Bind(λ)).Call()
  return λ.getter.Call()
}
ahk_13(λ) {
  return λ.result := 42
}
ahk_14(λ) {
  return (Func("ahk_13").Bind(λ)).Call()
}
ahk_15(λ) {
  λ.result := 0
  (Func("ahk_14").Bind(λ)).Call()
  return λ.result
}
ahk_16(λ) {
  return λ.i
}
ahk_17(λ, i) {
  λ.i := i
  return λ.fns.push.Call(Func("ahk_16").Bind(λ))
}
ahk_18(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    (Func("ahk_17").Bind(λ)).Call()
  }
  return λ.fns
}
ahk_19(λ) {
  return λ.x := 2
}
ahk_20(λ) {
  λ.x := 1
  (Func("ahk_19").Bind(λ)).Call()
  return λ.x
}
ahk_21(λ) {
  return 1
}
ahk_22(λ) {
  for ℓi, a in [1, 2] {
    ℓi := ℓi - 1
    a++
  }
}
ahk_23(λ) {
  switch a > 1 {
    case 1: {
      a := 0
    }
  }
}
ahk_24(λ) {
  if (a > 1) {
    a := 1
  } else {
    a := 0
  }
}
ahk_25(λ) {
  return 5
}
ahk_26(λ) {
  return Func("ahk_25").Bind(λ)
}
ahk_27(λ) {
  return (Func("ahk_26").Bind(λ)).Call()
}
ahk_28(λ) {
  return 4
}
ahk_29(λ) {
  return 3
}
ahk_30(λ) {
  return 2
}
ahk_31(λ) {
  return 1
}