global __ci_ahk__ := Func("salt_1")
salt_1(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}

global fn := Func("ahk_6")
global result := (Func("ahk_3")).Call()
global arr := [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
global obj := {a: {b: {c: {d: 1}}}}
a[__ci_ahk__.Call(b[__ci_ahk__.Call(c[__ci_ahk__.Call(d)])])]
a.b.c.d.e
fn.Call().Call().Call()
ahk_1() {
  return 42
}
ahk_2() {
  return (Func("ahk_1")).Call()
}
ahk_3() {
  return (Func("ahk_2")).Call()
}
ahk_4() {
  return 1
}
ahk_5() {
  return Func("ahk_4")
}
ahk_6() {
  return Func("ahk_5")
}