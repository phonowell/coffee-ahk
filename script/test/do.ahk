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
ahk_1(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 1
}
ahk_2(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  for __index_for__, a in [1, 2] {
    a
  }
}
ahk_3(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  switch a > 1 {
    case 1: {
      0
    }
  }
}
ahk_4(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  if (a > 1) {
    1
  } else {
    0
  }
}
ahk_5(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 5
}
ahk_6(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return Func("ahk_5").Bind(__ctx__)
}
ahk_7(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return (Func("ahk_6").Bind(__ctx__)).Call()
}
ahk_8(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 4
}
ahk_9(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 3
}
ahk_10(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 2
}
ahk_11(__ctx__) {
  if (!__ctx__) __ctx__ := {}
  return 1
}