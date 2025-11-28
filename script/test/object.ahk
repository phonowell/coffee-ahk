global a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1}
a := {a: 1, b: 2}
a := {a: 1, b: 2, c: {a: 1, b: 2, c: 3}}
global fn := Func("ahk_1")
global ℓobject := {a: 1, b: 2, c: 3}
a := ℓobject["a"]
global b := ℓobject["b"]
global c := ℓobject["c"]
ahk_1(λ := "") {
  if (!λ) {
    λ := {}
  }
  a := {a: 1, b: {a: 1, b: 2}}
  λ.d := 1
}