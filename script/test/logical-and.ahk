global ℓand
global ℓor

global a := ((ℓand := b) ? 0 : ℓand)
global x := ((ℓand := y) ? "yes" : ℓand)
global z := ((ℓand := w) ? -1 : ℓand)
global p := q && r
global flag := x && true
global deep := ((ℓand := u) ? ((ℓand := v) ? "fallback" : ℓand) : ℓand)
global fn := Func("ahk_2").Bind({})
global m1 := ((ℓor := a) ? ℓor : ((ℓand := b) ? "c" : ℓand))
global m2 := ((ℓor := a && b) ? ℓor : "c")
global m3 := a && b || c
global m4 := ((ℓand := (a || b)) ? "c" : ℓand)
global m5 := ((ℓor := a) ? ℓor : (((ℓand := b) ? "c" : ℓand)))
global c1 := f.Call(((ℓand := a) ? "c" : ℓand))
global o1 := {k: ((ℓand := a) ? "b" : ℓand)}
global n1 := [((ℓor := a) ? ℓor : "d"), ((ℓand := b) ? "e" : ℓand)]
global r1 := Func("ahk_1").Bind({})
ahk_1(λ) {
  return ((ℓor := a) ? ℓor : "c")
}
ahk_2(λ, val) {
  λ.val := val
  λ.count := ((ℓand := λ.val) ? 42 : ℓand)
  λ.name := ((ℓand := λ.val) ? "test" : ℓand)
  λ.other := λ.val && λ.fallback
  return {count: λ.count, name: λ.name, other: λ.other}
}