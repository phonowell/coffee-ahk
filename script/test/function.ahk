global fn := Func("ahk_13")
fn := Func("ahk_12")
fn := Func("ahk_11")
fn := Func("ahk_10")
fn.Call(1, 2)
fn.Call(fn.Call(fn))
fn := Func("ahk_9")
fn := Func("ahk_8")
(Func("ahk_4")).Call()
ahk_1(λ := "", a, b) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_2(λ := "", a) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  return λ.a + λ.b
}
ahk_3(λ := "") {
  if (!λ) {
    λ := {}
  }
  return λ.a + λ.b
}
ahk_4(λ := "") {
  if (!λ) {
    λ := {}
  }
  λ.fn1 := Func("ahk_3").Bind(λ)
  λ.fn2 := Func("ahk_2").Bind(λ)
  λ.fn3 := Func("ahk_1").Bind(λ)
}
ahk_5(λ := "") {
  if (!λ) {
    λ := {}
  }
  return λ.a + λ.b + λ.c
}
ahk_6(λ := "") {
  if (!λ) {
    λ := {}
  }
  λ.c := 3
  return (Func("ahk_5").Bind(λ)).Call()
}
ahk_7(λ := "", b := 2) {
  if (!λ) {
    λ := {}
  }
  λ.b := b
  return (Func("ahk_6").Bind(λ)).Call()
}
ahk_8(λ := "") {
  if (!λ) {
    λ := {}
  }
  λ.a := 1
  return (Func("ahk_7").Bind(λ)).Call()
}
ahk_9(λ := "", a, b, c) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  λ.b := b
  λ.c := c
  λ.a
  λ.b.Call()
  λ.c.Call(λ.a)
}
ahk_10(λ := "", a := 1, b := 2) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  λ.b := b
  return λ.a + λ.b
}
ahk_11(λ := "", a, b*) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  λ.b := b
  return λ.b[2]
}
ahk_12(λ := "", a := 1) {
  if (!λ) {
    λ := {}
  }
  λ.a := a
  return λ.a
}
ahk_13(λ := "") {
  if (!λ) {
    λ := {}
  }
  return 1
}