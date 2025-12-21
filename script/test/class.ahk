global ℓci_ahk := Func("salt_1").Bind({})
salt_1(λ, ℓarr, ℓidx) {
  if ℓidx is Number
  {
    if (ℓidx < 0) {
      return ℓarr.Length() + ℓidx + 1
    }
    return ℓidx + 1
  }
  return ℓidx
}

class Ｂb {
  a := Func("ahk_20").Bind({}, this)
}
class Ａa extends Ｂb {
  a := 0
  b := {}
  c := {a: 1}
  __New() {
    base.__New()
    base.a.Call()
    return (Func("ahk_19").Bind(λ, this)).Call(this)
  }
  d := Func("ahk_18").Bind({}, this)
  e := Func("ahk_17").Bind({}, this)
  f := Func("ahk_16").Bind({}, this)
}
global b := new Ａa()
class Ｐerson {
  __New(name, age) {
    this.name := name
    this.age := age
  }
  greet := Func("ahk_14").Bind({}, this)
  getInfo := Func("ahk_13").Bind({}, this)
}
class Ｃalculator {
  __New(initial) {
    this.value := initial
  }
  add := Func("ahk_12").Bind({}, this)
  multiply := Func("ahk_11").Bind({}, this)
  chain := Func("ahk_10").Bind({}, this)
}
class Ｃounter {
  __New() {
    this.count := 0
  }
  increment := Func("ahk_9").Bind({}, this)
  getCounter := Func("ahk_7").Bind({}, this)
}
class Ｇreeter {
  __New(prefix) {
    this.prefix := prefix
  }
  format := Func("ahk_5").Bind({}, this)
  say := Func("ahk_4").Bind({}, this)
}
class ＫeyＢindingＳhell {
  __New() {
    this.mapBound := {}
    this.mapCallback := {}
    this.mapPrevented := {}
  }
  prepare := Func("ahk_3").Bind({}, this)
  fire := Func("ahk_1").Bind({}, this)
}
global person := new Ｐerson("Alice", 30)
global calc := new Ｃalculator(10)
global counter := new Ｃounter()
global greeter := new Ｇreeter("Info")
ahk_1(λ, ℓthis, key) {
  this := ℓthis
  λ.key := key
  return λ.console.log.Call("Firing: ".key)
}
ahk_2(λ, ℓthis) {
  this := ℓthis
  return this.fire.Call(λ.key)
}
ahk_3(λ, ℓthis, key) {
  this := ℓthis
  λ.key := key
  if (this.mapCallback[ℓci_ahk.Call(.mapCallback, λ.key)]) {
    return
  }
  this.mapBound[ℓci_ahk.Call(.mapBound, λ.key)] := Func("ahk_2").Bind(λ, this)
  this.mapCallback[ℓci_ahk.Call(.mapCallback, λ.key)] := []
  this.mapPrevented[ℓci_ahk.Call(.mapPrevented, λ.key)] := false
  return
}
ahk_4(λ, ℓthis, message) {
  this := ℓthis
  λ.message := message
  return this.format.Call(λ.message)
}
ahk_5(λ, ℓthis, text) {
  this := ℓthis
  λ.text := text
  return "" . (this.prefix) . ": " . (λ.text) . ""
}
ahk_6(λ, ℓthis) {
  this := ℓthis
  return this.count
}
ahk_7(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_6").Bind(λ, this)).Call(this)
}
ahk_8(λ, ℓthis) {
  this := ℓthis
  return this.count := this.count + 1
}
ahk_9(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_8").Bind(λ, this)).Call(this)
}
ahk_10(λ, ℓthis, n) {
  this := ℓthis
  λ.n := n
  this.value := this.value + λ.n
  return this
}
ahk_11(λ, ℓthis, a, b, c) {
  this := ℓthis
  λ.a := a
  λ.b := b
  λ.c := c
  return λ.a * b * λ.c
}
ahk_12(λ, ℓthis, x, y) {
  this := ℓthis
  λ.x := x
  λ.y := y
  return λ.x + λ.y
}
ahk_13(λ, ℓthis) {
  this := ℓthis
  return {name: this.name, age: this.age}
}
ahk_14(λ, ℓthis, greeting) {
  this := ℓthis
  λ.greeting := greeting
  return "" . (λ.greeting) . ", " . (this.name) . "!"
}
ahk_15(λ, ℓthis) {
  this := ℓthis
  return this.a
}
ahk_16(λ, ℓthis) {
  this := ℓthis
  return (Func("ahk_15").Bind(λ, this)).Call(this)
}
ahk_17(λ, ℓthis, n) {
  this := ℓthis
  λ.n := n
  return this.a + λ.n
}
ahk_18(λ, ℓthis) {
  this := ℓthis
  return 1
}
ahk_19(λ, ℓthis) {
  this := ℓthis
  return this.a
}
ahk_20(λ, ℓthis) {
  this := ℓthis
  return 42
}