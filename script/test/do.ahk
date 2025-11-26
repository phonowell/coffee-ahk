(Func("ahk_11")).Call()
global fn := Func("ahk_10")
(fn).Call()
global a := (Func("ahk_9")).Call()
global b := {c: (Func("ahk_8")).Call()}
global d := (Func("ahk_7")).Call()
(Func("ahk_4")).Call()
(Func("ahk_3")).Call()
(Func("ahk_2")).Call()
(Func("ahk_1")).Call()
ahk_1(λ) {
  if (!λ) λ := {}
  return 1
}
ahk_2(λ) {
  if (!λ) λ := {}
  for ℓi, a in [1, 2] {
    ℓi := ℓi - 1
    a
  }
}
ahk_3(λ) {
  if (!λ) λ := {}
  switch a > 1 {
    case 1: {
      0
    }
  }
}
ahk_4(λ) {
  if (!λ) λ := {}
  if (a > 1) {
    1
  } else {
    0
  }
}
ahk_5(λ) {
  if (!λ) λ := {}
  return 5
}
ahk_6(λ) {
  if (!λ) λ := {}
  return Func("ahk_5").Bind(λ)
}
ahk_7(λ) {
  if (!λ) λ := {}
  return (Func("ahk_6").Bind(λ)).Call()
}
ahk_8(λ) {
  if (!λ) λ := {}
  return 4
}
ahk_9(λ) {
  if (!λ) λ := {}
  return 3
}
ahk_10(λ) {
  if (!λ) λ := {}
  return 2
}
ahk_11(λ) {
  if (!λ) λ := {}
  return 1
}