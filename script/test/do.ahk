(Func("ahk_32").Bind({})).Call()
global fn := Func("ahk_31").Bind({})
(fn).Call()
global a := (Func("ahk_30").Bind({})).Call()
global b := {c: (Func("ahk_29").Bind({})).Call()}
global d := (Func("ahk_28").Bind({})).Call()
(Func("ahk_25").Bind({})).Call()
(Func("ahk_24").Bind({})).Call()
(Func("ahk_23").Bind({})).Call()
(Func("ahk_22").Bind({})).Call()
global fn1 := Func("ahk_21").Bind({})
global fn2 := Func("ahk_19").Bind({})
global fn3 := Func("ahk_16").Bind({})
global fn4 := Func("ahk_13").Bind({})
global fn5 := Func("ahk_10").Bind({})
global fn6 := Func("ahk_8").Bind({})
global fn7 := Func("ahk_6").Bind({})
global fn8 := Func("ahk_3").Bind({})
global r1 := f.Call(x, (Func("ahk_1").Bind({})).Call())
ahk_1(λ) {
  return λ.y
}
ahk_2(λ) {
  return λ.m + λ.n
}
ahk_3(λ) {
  λ.m := 1
  λ.n := 2
  λ.result := (Func("ahk_2").Bind(λ)).Call()
  return λ.result
}
ahk_4(λ) {
  return λ.counter += 1
}
ahk_5(λ) {
  λ.counter += 1
  Func("ahk_4").Bind(λ)
}
ahk_6(λ) {
  λ.counter := 0
  λ.increment := (Func("ahk_5").Bind(λ)).Call()
  λ.increment.Call()
  return λ.counter
}
ahk_7(λ) {
  return λ.sum += λ.i
}
ahk_8(λ) {
  λ.sum := 0
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    (Func("ahk_7").Bind(λ)).Call()
  }
  return λ.sum
}
ahk_9(λ) {
  return λ.value := "modified"
}
ahk_10(λ) {
  λ.value := "initial"
  λ.flag := true
  if (λ.flag) {
    (Func("ahk_9").Bind(λ)).Call()
  }
  return λ.value
}
ahk_11(λ) {
  return λ.x
}
ahk_12(λ) {
  return Func("ahk_11").Bind(λ)
}
ahk_13(λ) {
  λ.x := 10
  λ.getter := (Func("ahk_12").Bind(λ)).Call()
  return λ.getter.Call()
}
ahk_14(λ) {
  return λ.result := 42
}
ahk_15(λ) {
  return (Func("ahk_14").Bind(λ)).Call()
}
ahk_16(λ) {
  λ.result := 0
  (Func("ahk_15").Bind(λ)).Call()
  return λ.result
}
ahk_17(λ) {
  return λ.i
}
ahk_18(λ, i) {
  λ.i := i
  return λ.fns.push.Call(Func("ahk_17").Bind(λ))
}
ahk_19(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    (Func("ahk_18").Bind(λ)).Call(λ.i)
  }
  return λ.fns
}
ahk_20(λ) {
  return λ.x := 2
}
ahk_21(λ) {
  λ.x := 1
  (Func("ahk_20").Bind(λ)).Call()
  return λ.x
}
ahk_22(λ) {
  return 1
}
ahk_23(λ) {
  for ℓi, a in [1, 2] {
    a++
  }
}
ahk_24(λ) {
  switch a > 1 {
    case 1: {
      a := 0
    }
  }
}
ahk_25(λ) {
  if (a > 1) {
    return a := 1
  } else {
    return a := 0
  }
}
ahk_26(λ) {
  return 5
}
ahk_27(λ) {
  return Func("ahk_26").Bind(λ)
}
ahk_28(λ) {
  return (Func("ahk_27").Bind(λ)).Call()
}
ahk_29(λ) {
  return 4
}
ahk_30(λ) {
  return 3
}
ahk_31(λ) {
  return 2
}
ahk_32(λ) {
  return 1
}