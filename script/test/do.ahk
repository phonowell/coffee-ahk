(Func("ahk_11").Bind({})).Call()
global fn := Func("ahk_10").Bind({})
(fn).Call()
global a := (Func("ahk_9").Bind({})).Call()
global b := {c: (Func("ahk_8").Bind({})).Call()}
global d := (Func("ahk_7").Bind({})).Call()
(Func("ahk_4").Bind({})).Call()
(Func("ahk_3").Bind({})).Call()
(Func("ahk_2").Bind({})).Call()
(Func("ahk_1").Bind({})).Call()
ahk_1(λ) {
  return 1
}
ahk_2(λ) {
  for ℓi, a in [1, 2] {
    ℓi := ℓi - 1
    a
  }
}
ahk_3(λ) {
  switch a > 1 {
    case 1: {
      0
    }
  }
}
ahk_4(λ) {
  if (a > 1) {
    1
  } else {
    0
  }
}
ahk_5(λ) {
  return 5
}
ahk_6(λ) {
  return Func("ahk_5").Bind(λ)
}
ahk_7(λ) {
  return (Func("ahk_6").Bind(λ)).Call()
}
ahk_8(λ) {
  return 4
}
ahk_9(λ) {
  return 3
}
ahk_10(λ) {
  return 2
}
ahk_11(λ) {
  return 1
}