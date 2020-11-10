global __ctx_ahk__ := {}
global a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1, b: 2, c: {a: 1, b: 2, c: 3}}
global fn := Func("ahk_1")
ahk_1() {
  a := {a: 1, b: {a: 1, b: 2}}
  a := 1
}