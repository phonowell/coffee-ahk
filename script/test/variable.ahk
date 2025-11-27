global a := 1
a := 2
global fn := Func("ahk_3")
global c := 1
c := 2
fn := Func("ahk_2")
global ℓarray := [1, 2]
a := ℓarray[1]
global b := ℓarray[2]
ℓarray := [1, 2, 3]
a := ℓarray[1]
ℓarray := list
a := ℓarray[1]
b := ℓarray[2]
ℓarray := fn.Call()
a := ℓarray[1]
b := ℓarray[2]
fn := Func("ahk_1")
ahk_1(λ := "") {
  if (!λ) λ := {}
  ℓarray := [1, 2, 3]
  a := ℓarray[1]
  b := ℓarray[2]
  c := ℓarray[3]
}
ahk_2(λ := "") {
  if (!λ) λ := {}
  return c := 3
}
ahk_3(λ := "") {
  if (!λ) λ := {}
  b := 1
  b := 2
}