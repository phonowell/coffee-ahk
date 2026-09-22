global collect := Func("ahk_5").Bind({})
global mixed := Func("ahk_4").Bind({})
global postfix := Func("ahk_3").Bind({})
global gather := Func("ahk_2").Bind({})
global onlyRest := Func("ahk_1").Bind({})
ahk_1(λ, args*) {
  λ.args := args
  return λ.args
}
ahk_2(λ, first, rest*) {
  λ.first := first
  λ.rest := rest
  return λ.rest.length
}
ahk_3(λ, list) {
  λ.list := list
  return λ.sum.Call(λ.list*)
}
ahk_4(λ, head, rest) {
  λ.head := head
  λ.rest := rest
  return λ.merge.Call(λ.head, λ.rest*)
}
ahk_5(λ, list) {
  λ.list := list
  return λ.sum.Call(λ.list*)
}