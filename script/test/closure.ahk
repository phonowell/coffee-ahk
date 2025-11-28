global outer1 := Func("ahk_30").Bind({})
global outer2 := Func("ahk_28").Bind({})
global outer3 := Func("ahk_25").Bind({})
global outer4 := Func("ahk_23").Bind({})
global outer5 := Func("ahk_20").Bind({})
global outer6 := Func("ahk_18").Bind({})
global outer7 := Func("ahk_16").Bind({})
global makeCounter := Func("ahk_14").Bind({})
global outer9 := Func("ahk_12").Bind({})
global outer10 := Func("ahk_9").Bind({})
global outer11 := Func("ahk_7").Bind({})
global outer12 := Func("ahk_6").Bind({})
global outer13 := Func("ahk_4").Bind({})
global outer14 := Func("ahk_2").Bind({})
ahk_1(λ) {
  return λ.first := "changed"
}
ahk_2(λ, first, rest*) {
  λ.first := first
  λ.rest := rest
  λ.modify := Func("ahk_1").Bind(λ)
  λ.modify.Call()
  return λ.first
}
ahk_3(λ) {
  return λ.x := λ.x * 2
}
ahk_4(λ, x) {
  λ.x := x
  λ.doubler := Func("ahk_3").Bind(λ)
  λ.doubler.Call()
  return λ.x
}
ahk_5(λ) {
  λ.temp := λ.a
  λ.a := λ.b
  λ.b := λ.temp
}
ahk_6(λ) {
  ℓarray := [1, 2]
  λ.a := ℓarray[1]
  λ.b := ℓarray[2]
  λ.swap := Func("ahk_5").Bind(λ)
  λ.swap.Call()
  return [λ.a, λ.b]
}
ahk_7(λ, obj) {
  λ.obj := obj
  λ.result := ""
  for key, value in λ.obj {
    λ.key := key
    λ.value := value
    λ.result := "" . (λ.result) . ", " . (λ.key) . ": " . (λ.value) . ""
  }
  return λ.result
}
ahk_8(λ) {
  λ.data := "processed"
  λ.callback.Call(λ.data)
}
ahk_9(λ, callback) {
  λ.callback := callback
  λ.data := "initial"
  λ.doProcess := Func("ahk_8").Bind(λ)
  λ.doProcess.Call()
  return λ.data
}
ahk_10(λ, v) {
  λ.v := v
  return λ.secret := λ.v
}
ahk_11(λ) {
  return λ.secret
}
ahk_12(λ) {
  λ.secret := "hidden"
  λ.obj := {get: Func("ahk_11").Bind(λ), set: Func("ahk_10").Bind(λ)}
  return λ.obj
}
ahk_13(λ) {
  λ.count++
  return λ.count
}
ahk_14(λ) {
  λ.count := 0
  return Func("ahk_13").Bind(λ)
}
ahk_15(λ) {
  return λ.sum += 10
}
ahk_16(λ) {
  λ.count := 0
  λ.sum := 0
  while (λ.count < 3) {
    λ.count++
    λ.sum += λ.count
    λ.adder := Func("ahk_15").Bind(λ)
    λ.adder.Call()
  }
  return λ.sum
}
ahk_17(λ) {
  return λ.value := 2
}
ahk_18(λ) {
  λ.value := 0
  try {
    λ.value := 1
    λ.inner := Func("ahk_17").Bind(λ)
    λ.inner.Call()
  } catch e {
    λ.value := -1
  }
  return λ.value
}
ahk_19(λ) {
  return λ.result := "from inner"
}
ahk_20(λ) {
  λ.result := "default"
  λ.flag := true
  if (λ.flag) {
    λ.result := "modified"
    λ.inner := Func("ahk_19").Bind(λ)
    λ.inner.Call()
  }
  return λ.result
}
ahk_21(λ) {
  return λ.i
}
ahk_22(λ, i) {
  λ.i := i
  return λ.fns.push.Call(Func("ahk_21").Bind(λ))
}
ahk_23(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    (Func("ahk_22").Bind(λ)).Call()
  }
  return λ.fns
}
ahk_24(λ) {
  return λ.i
}
ahk_25(λ) {
  λ.fns := []
  for ℓi, i in [1, 2, 3] {
    λ.i := i
    ℓi := ℓi - 1
    λ.fns.push.Call(Func("ahk_24").Bind(λ))
  }
  return λ.fns
}
ahk_26(λ) {
  λ.a := 10
  λ.b := 20
}
ahk_27(λ) {
  λ.b := 2
  λ.level2 := Func("ahk_26").Bind(λ)
  λ.level2.Call()
  return λ.a + λ.b
}
ahk_28(λ) {
  λ.a := 1
  λ.level1 := Func("ahk_27").Bind(λ)
  return λ.level1.Call()
}
ahk_29(λ) {
  return λ.x := 2
}
ahk_30(λ) {
  λ.x := 1
  λ.inner := Func("ahk_29").Bind(λ)
  λ.inner.Call()
  return λ.x
}