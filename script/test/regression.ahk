global ℓor
global ℓand
global chainB
class ＯnlyＫlass {
  greet := Func("ahk_19").Bind({}, this)
}
global ℓm_ahk_2 := (Func("ahk_18").Bind({})).Call()
for ℓi, rv in [1, 2] {
  global rv
  global cbFor := Func("ahk_17").Bind({})
}
for rk, rv2 in {a: 1} {
  global rk
  global rv2
  global cbOf := Func("ahk_16").Bind({})
}
try {
  mayFail.Call()
} catch rerr {
  global rerr
  global cbCatch := Func("ahk_15").Bind({})
}
if (flagA) {
  global inner := 1
}
global fat := Func("ahk_14").Bind({})
global tier := scoreA ? 1 : scoreB ? 2 : 3
global maybe := flagA ? 1 : ""
global conf := ((ℓor := port) ? ℓor : ((ℓor := host) ? ℓor : "localhost"))
global withCb := Func("ahk_13").Bind({})
global doc := "line1`nline2"
global fake := "import ghost from './no-such-file'"
global okInst := new ＯnlyＫlass()
global andVal := ((ℓand := flagA) ? "yes" : ℓand)
global andDeep := ((ℓand := flagA) ? ((ℓand := flagB) ? "deep" : ℓand) : ℓand)
global retIf := Func("ahk_11").Bind({})
global tailIf := Func("ahk_10").Bind({})
global tailNest := Func("ahk_9").Bind({})
global tailMulti := Func("ahk_8").Bind({})
global tailUnless := Func("ahk_7").Bind({})
global doRes := (Func("ahk_6").Bind({})).Call(dv)
global doDef := (Func("ahk_5").Bind({})).Call(da, 2)
global doNest := (Func("ahk_4").Bind({})).Call(Math.max.Call(1, 2), f.Call(3, 4))
global chainA := chainB := 1
global chainCb := Func("ahk_3").Bind({})
class ＲegＢase {
  speak := Func("ahk_2").Bind({}, this)
}
class ＲegＣhild extends ＲegＢase {
  __New() {
    base.__New()
  }
  speak := Func("ahk_1").Bind({}, this)
}
global bracedObj := {k1: 1, k2: 2}
ahk_1(λ, ℓthis) {
  this := ℓthis
  return base.speak.Call(1)
}
ahk_2(λ, ℓthis) {
  this := ℓthis
  return "base"
}
ahk_3(λ) {
  return chainB
}
ahk_4(λ, dn := Math.max.Call(1, 2), dn2 := f.Call(3, 4)) {
  λ.dn := dn
  λ.Math := Math
  λ.dn2 := dn2
  return λ.dn + λ.dn2
}
ahk_5(λ, da, db := 2) {
  λ.da := da
  λ.db := db
  return λ.da + λ.db
}
ahk_6(λ, dv) {
  λ.dv := dv
  return λ.dv * 2
}
ahk_7(λ) {
  if !(λ.flagA) {
    return 6
  } else {
    return 7
  }
}
ahk_8(λ) {
  if (λ.flagA) {
    λ.tmp := 1
    return λ.tmp + 1
  }
}
ahk_9(λ) {
  if (λ.flagA) {
    if (λ.flagB) {
      return 5
    }
  }
}
ahk_10(λ) {
  if (λ.flagA) {
    return 3
  } else {
    return 4
  }
}
ahk_11(λ) {
  return λ.flagA ? 1 : 2
}
ahk_12(λ) {
  return 1
}
ahk_13(λ, cb := Func("ahk_12").Bind({})) {
  λ.cb := cb
  return λ.cb.Call()
}
ahk_14(λ, ℓthis) {
  this := ℓthis
  return this.x
}
ahk_15(λ) {
  return rerr
}
ahk_16(λ) {
  return rk + rv2
}
ahk_17(λ) {
  return rv
}
ahk_18(λ) {
  return λ.noopVal := 42
}
ahk_19(λ, ℓthis) {
  this := ℓthis
  return "hi"
}