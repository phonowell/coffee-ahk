global a := b ? b : 0
global x := y ? y : "default"
global z := w ? w : -1
global p := q || r
global flag := x || true
global fn := Func("ahk_1").Bind({})
ahk_1(λ, val) {
  λ.val := val
  λ.count := λ.val ? λ.val : 42
  λ.name := λ.val ? λ.val : "test"
  λ.other := λ.val || λ.fallback
  return {count: λ.count, name: λ.name, other: λ.other}
}