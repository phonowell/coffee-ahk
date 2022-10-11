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
ahk_1() {
  return 1
}
ahk_2() {
  for __index_for__, a in [1, 2] {
    a
  }
}
ahk_3() {
  switch a > 1 {
    case 1: {
      0
    }
  }
}
ahk_4() {
  if (a > 1) {
    1
  } else {
    0
  }
}
ahk_5() {
  return 5
}
ahk_6() {
  return Func("ahk_5")
}
ahk_7() {
  (Func("ahk_6")).Call()
}
ahk_8() {
  return 4
}
ahk_9() {
  return 3
}
ahk_10() {
  return 2
}
ahk_11() {
  return 1
}