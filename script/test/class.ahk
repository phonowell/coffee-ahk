class Ｂb {
  a := Func("ahk_17").Bind({}, this)
}
class Ａa extends Ｂb {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    base.a.Call()
    return (Func("ahk_16").Bind(λ)).Call(this)
  }
  d := Func("ahk_15").Bind({}, this)
  e := Func("ahk_14").Bind({}, this)
  f := Func("ahk_13").Bind({}, this)
}
global b := new Ａa()
class Ｐerson {
  __New(name, age) {
    this.name := name
    this.age := age
  }
  greet := Func("ahk_11").Bind({}, this)
  getInfo := Func("ahk_10").Bind({}, this)
}
class Ｃalculator {
  __New(initial) {
    this.value := initial
  }
  add := Func("ahk_9").Bind({}, this)
  multiply := Func("ahk_8").Bind({}, this)
  chain := Func("ahk_7").Bind({}, this)
}
class Ｃounter {
  __New() {
    this.count := 0
  }
  increment := Func("ahk_6").Bind({}, this)
  getCounter := Func("ahk_4").Bind({}, this)
}
class Ｇreeter {
  __New(prefix) {
    this.prefix := prefix
  }
  format := Func("ahk_2").Bind({}, this)
  say := Func("ahk_1").Bind({}, this)
}
global person := new Ｐerson("Alice", 30)
global calc := new Ｃalculator(10)
global counter := new Ｃounter()
global greeter := new Ｇreeter("Info")
ahk_1(λ, ℓthis, message) {
  this := ℓthis
  return this.format.Call(message)
}
ahk_2(λ, ℓthis, text) {
  this := ℓthis
  return "" . (this.prefix) . ": " . (text) . ""
}
ahk_3(λ, ℓthis) {
  this := ℓthis
  return this.count
}
ahk_4(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_3").Bind(λ)).Call(this)
}
ahk_5(λ, ℓthis) {
  this := ℓthis
  return this.count := this.count + 1
}
ahk_6(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_5").Bind(λ)).Call(this)
}
ahk_7(λ, ℓthis, n) {
  this := ℓthis
  this.value := this.value + n
  
}
ahk_8(λ, ℓthis, a, b, c) {
  this := ℓthis
  return a * b * c
}
ahk_9(λ, ℓthis, x, y) {
  this := ℓthis
  return x + y
}
ahk_10(λ, ℓthis) {
  this := ℓthis
  return {name: this.name, age: this.age}
}
ahk_11(λ, ℓthis, greeting) {
  this := ℓthis
  return "" . (greeting) . ", " . (this.name) . "!"
}
ahk_12(λ, ℓthis) {
  this := ℓthis
  return this.a
}
ahk_13(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_12").Bind(λ)).Call(this)
}
ahk_14(λ, ℓthis, n) {
  this := ℓthis
  return this.a + n
}
ahk_15(λ, ℓthis) {
  this := ℓthis
  return 1
}
ahk_16(λ, ℓthis) {
  this := ℓthis
  return this.a
}
ahk_17(λ, ℓthis) {
  this := ℓthis
  return 42
}