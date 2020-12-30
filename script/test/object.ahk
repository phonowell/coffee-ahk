global a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1, b: 2, c: {a: 1, b: 2, c: 3}}
global fn := Func("ahk_1")
global __object__ := {a: 1, b: 2, c: 3}
a := __object__["a"]
global b := __object__["b"]
global c := __object__["c"]
ahk_1() {
  a := {a: 1, b: {a: 1, b: 2}}
  d := 1
}
