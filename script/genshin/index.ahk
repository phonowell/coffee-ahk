
#KeyHistory, 0
#MaxThreads, 20
#NoEnv
#Persistent
#SingleInstance, Force
#UseHook, On

CoordMode, Mouse, Client
CoordMode, Pixel, Client
CoordMode, ToolTip, Client
SendMode, Event
SetBatchLines, 100ms
SetKeyDelay, 0, 50
SetMouseDelay, 0, 50
StringCaseSense, On

class Toolkit {
  abs(n) {
    return Abs(n)
  }
  alert(message) {
    MsgBox, % message
    return message
  }
  beep() {
    SoundBeep
  }
  ceil(n) {
    return Ceil(n)
  }
  click(input) {
    if !(input) {
      Click
      return
    }
    Click, % StrReplace input, ":", " "
  }
  exit() {
    ExitApp
  }
  floor(n) {
    return Floor(n)
  }
  move(x := 0, y := 0, speed := 0) {
    MouseMove, x, y, speed
    return [x, y, speed]
  }
  now() {
    return A_TickCount
  }
  off(key, fn) {
    Hotkey, % key, % fn, Off
  }
  on(key, fn) {
    Hotkey, % key, % fn, On
  }
  random(min := 0, max := 1) {
    Random, __Result__, min, max
    return __Result__
  }
  reload() {
    Reload
  }
  replace(input, searchment, replacement, limit := -1) {
    return StrReplace(input, searchment, replacement, limit)
  }
  round(n) {
    return Round(n)
  }
  sleep(time) {
    Sleep, % time
  }
  toLowerCase(input) {
    StringLower, __Result__, input
    return __Result__
  }
  toUpperCase(input) {
    StringUpper, __Result__, input
    return __Result__
  }
  trim(input, omit := " `t") {
    return Trim(input, omit)
  }
  trimEnd(input, omit := " `t") {
    return RTrim(input, omit)
  }
  trimStart(input, omit := " `t") {
    return LTrim(input, omit)
  }
}
global $ := new Toolkit()
actionE() { ; function
  $.press("e")
}
autoJump() {
  $.clearTimeout("jump")
  jump()
  $.setTimeout("jump", 200)
}
changeCharacter1() {
  $.clearTimeout("actionE")
  $.press("1")
  $.setTimeout("actionE", 200)
}
changeCharacter2() {
  $.clearTimeout("actionE")
  $.press("2")
  $.setTimeout("actionE", 200)
}
changeCharacter3() {
  $.clearTimeout("actionE")
  $.press("3")
  $.setTimeout("actionE", 200)
}
changeCharacter4() {
  $.clearTimeout("actionE")
  $.press("4")
  $.setTimeout("actionE", 200)
}
changeCharacter5() {
  $.clearTimeout("actionE")
  $.press("5")
  $.setTimeout("actionE", 200)
}
jump() {
  $.press("space")
}
$.on("1", "changeCharacter1") ; binding
$.on("2", "changeCharacter2")
$.on("3", "changeCharacter3")
$.on("4", "changeCharacter4")
$.on("5", "changeCharacter5")
$.on("space", "autoJump")
