global a := ((ℓor := b) ? ℓor : 0)
global x := ((ℓor := y) ? ℓor : "default")
global z := ((ℓor := w) ? ℓor : -1)
global p := q || r
global flag := x || true
global fn := Func("ahk_1").Bind({})
ahk_1(λ, val) {
  λ.val := val
  λ.count := ((ℓor := λ.val) ? ℓor : 42)
  λ.name := ((ℓor := λ.val) ? ℓor : "test")
  λ.other := λ.val || λ.fallback
  return {count: λ.count, name: λ.name, other: λ.other}
}