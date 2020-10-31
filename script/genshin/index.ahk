﻿if (A_IsAdmin != true) {
  Run *RunAs "%A_ScriptFullPath%"
  ExitApp
}
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
global $ := {}
$.reverse := Func("hk2najs5beg_43") ; reverse(input: unknown[]): unknown[]
$.includes := Func("hk2najs5beg_42")
$.length := Func("hk2najs5beg_41") ; length(input: string | array | object): number
$.type := Func("hk2najs5beg_40") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("hk2najs5beg_39") ; findColor( color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation = 0 ): Point
$.findImage := Func("hk2najs5beg_38") ; findImage( source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], ): Point
$.getColor := Func("hk2najs5beg_37") ; getColor(point?: Point): number
$.getPosition := Func("hk2najs5beg_36") ; getPosition(): Point
$.getState := Func("hk2najs5beg_35") ; getState(key: string): string
$.formatHotkey := Func("hk2najs5beg_34") ; formatHotkey(key: string): string
$.now := Func("hk2najs5beg_33") ; now(): number
$.random := Func("hk2najs5beg_32") ; random(min: number = 0, max: number = 1): number
$.click := Func("hk2najs5beg_31") ; click(key?: string): void
$.move := Func("hk2najs5beg_30") ; move(point: Point, speed: number = 0): void
$.press := Func("hk2najs5beg_29") ; press(key...: string): void
$.setFixed := Func("hk2najs5beg_28") ; setFixed(fixed?: boolean): void
$.beep := Func("hk2najs5beg_27") ; beep(): void
$.i := Func("hk2najs5beg_26") ; i(message: string): string
$.info := Func("hk2najs5beg_25") ; info(message: string, point?: Point): string
$.replace := Func("hk2najs5beg_24") ; replace( input: string, searchment: string, replacement: string, limit: number = -1 )
$.split := Func("hk2najs5beg_23") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("hk2najs5beg_22") ; toLowerCase(input: string): string
$.toString := Func("hk2najs5beg_21") ; toString(input: unknown): string
$.toUpperCase := Func("hk2najs5beg_20") ; toUpperCase(input: string): string
$.trim := Func("hk2najs5beg_19") ; trim(input: string, omitting: string): string
$.trimEnd := Func("hk2najs5beg_18") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("hk2najs5beg_17") ; trimStart(input: string, omitting: string): string
$.exit := Func("hk2najs5beg_16") ; exit(): void
$.off := Func("hk2najs5beg_15") ; off(key: string, fn: Function | string): void
$.on := Func("hk2najs5beg_14") ; on(key, string, fn: Function | string): void
$.open := Func("hk2najs5beg_13") ; open(source: string): void
$.reload := Func("hk2najs5beg_12") ; reload(): void
$.sleep := Func("hk2najs5beg_11") ; sleep(time: number): void
$.suspend := Func("hk2najs5beg_10") ; suspend(suspended?: boolean): void
global Math := {abs: Func("hk2najs5beg_9"), ceil: Func("hk2najs5beg_8"), floor: Func("hk2najs5beg_7"), round: Func("hk2najs5beg_6")} ; abs(n: number): number ceil(n: number): number floor(n: number): number round(n: number): number
global alert := Func("hk2najs5beg_5") ; alert(message: string): string
global clearInterval := Func("hk2najs5beg_4") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("hk2najs5beg_3") ; clearTimeout(fn: Function | string): void
global setInterval := Func("hk2najs5beg_2") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("hk2najs5beg_1") ; setTimeout(fn: Function | string, time: number): string
hk2najs5beg_1(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
hk2najs5beg_2(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
hk2najs5beg_3(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
hk2najs5beg_4(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
hk2najs5beg_5(message := "") {
  if !(message) {
    return
  }
  _msg := $.toString.Call(message)
  MsgBox, % _msg
  return message
}
hk2najs5beg_6(n) {
  return Round(n)
}
hk2najs5beg_7(n) {
  return Floor(n)
}
hk2najs5beg_8(n) {
  return Ceil(n)
}
hk2najs5beg_9(n) {
  return Abs(n)
}
hk2najs5beg_10(isSuspended := "Toggle") {
  if (isSuspended != "Toggle") {
    if (isSuspended) {
      isSuspended := "On"
    } else {
      isSuspended := "Off"
    }
  }
  Suspend, % isSuspended
}
hk2najs5beg_11(time) {
  Sleep, % time
}
hk2najs5beg_12() {
  Reload
}
hk2najs5beg_13(source) {
  Run, % source
}
hk2najs5beg_14(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
hk2najs5beg_15(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
hk2najs5beg_16() {
  ExitApp
}
hk2najs5beg_17(input, omitting := " `t") {
  return LTrim(input, omitting)
}
hk2najs5beg_18(input, omitting := " `t") {
  return RTrim(input, omitting)
}
hk2najs5beg_19(input, omitting := " `t") {
  return Trim(input, omitting)
}
hk2najs5beg_20(input) {
  StringUpper, __Result__, input
  return __Result__
}
hk2najs5beg_21(input) {
  _type := $.type.Call(input)
  if (_type == "array") {
    _result := ""
    for __i__, key in input {
      _result := "" . (_result) . ", " . ($.toString.Call(key)) . ""
    }
    return "[" . ($.trim.Call(_result, " ,")) . "]"
  } else if (_type == "object") {
    _result := ""
    for key, value in input {
      _result := "" . (_result) . ", " . (key) . ": " . ($.toString.Call(value)) . ""
    }
    return "{" . ($.trim.Call(_result, " ,")) . "}"
  }
  return input
}
hk2najs5beg_22(input) {
  StringLower, __Result__, input
  return __Result__
}
hk2najs5beg_23(input, delimiter) {
  return StrSplit(input, delimiter)
}
hk2najs5beg_24(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
hk2najs5beg_25(message, point := "") {
  if !(message) {
    return message
  }
  if !(point) {
    point := $.getPosition.Call()
  }
  _msg := $.toString.Call(message)
  ToolTip, % _msg, % point[1], % point[2]
  return message
}
hk2najs5beg_26(message) {
  $.info.Call("" . ($.now.Call()) . " " . ($.toString.Call(message)) . "")
  return message
}
hk2najs5beg_27() {
  SoundBeep
}
hk2najs5beg_28(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
hk2najs5beg_29(listInput*) {
  if !($.length.Call(listInput)) { ; validate
    throw Exception("$.press: invalid key")
  }
  _listKey := [] ; format
  for __i__, input in listInput {
    _input := $.toLowerCase.Call(input)
    _input := $.replace.Call(_input, " ", "")
    _input := $.replace.Call(_input, "-", "")
    _list := $.split.Call(_input, "+")
    for __i__, it in _list {
      _listKey.Push(it)
    }
  }
  _listResult := [] ; unfold
  _len := $.length.Call(_listKey)
  for i, key in _listKey {
    if (i == _len) { ; last
      _listResult[i] := $.split.Call(key, ":")
      continue
    }
    if ($.includes.Call(key, ":")) { ; other
      _listResult[i] := $.split.Call(key, ":")
      _listResult[_len * 2 - i] := $.split.Call(key, ":")
    } else {
      _listResult[i] := [key, "down"]
      _listResult[_len * 2 - i] := [key, "up"]
    }
  }
  for i, it in _listResult {
    if (it[1] == "win") {
      it[1] := "lwin"
    }
    _listResult[i] := $.trim.Call("" . (it[1]) . " " . (it[2]) . "")
  }
  _output := "" ; execute
  for __i__, it in _listResult {
    _output := "" . (_output) . "{" . (it) . "}"
  }
  Send, % _output
}
hk2najs5beg_30(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
hk2najs5beg_31(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
hk2najs5beg_32(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
hk2najs5beg_33() {
  return A_TickCount
}
hk2najs5beg_34(key) {
  _listKey := [] ; format
  _key := $.toLowerCase.Call(key)
  _key := $.replace.Call(_key, " ", "")
  _key := $.replace.Call(_key, "-", "")
  _list := $.split.Call(_key, "+")
  for __i__, it in _list {
    _listKey.Push(it)
  }
  _isAlt := false ; unfold
  _isCtrl := false
  _isShift := false
  _isWin := false
  _listResult := []
  for __i__, key in _listKey {
    if (key == "alt") {
      _isAlt := true
      continue
    }
    if (key == "ctrl") {
      _isCtrl := true
      continue
    }
    if (key == "shift") {
      _isShift := true
      continue
    }
    if (key == "win") {
      _isWin := true
      continue
    }
    _listResult.Push(key)
  }
  _prefix := ""
  if (_isAlt) {
    _prefix := "" . (_prefix) . "!"
  }
  if (_isCtrl) {
    _prefix := "" . (_prefix) . "^"
  }
  if (_isShift) {
    _prefix := "" . (_prefix) . "+"
  }
  if (_isWin) {
    _prefix := "" . (_prefix) . "#"
  }
  _result := ""
  for __i__, it in _listResult {
    _result := "" . (_result) . " & " . (it) . ""
  }
  return $.replace.Call("" . (_prefix) . "" . ($.trim.Call(_result, " &")) . "", ":", " ")
}
hk2najs5beg_35(key) {
  return GetKeyState(key)
}
hk2najs5beg_36() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
hk2najs5beg_37(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
hk2najs5beg_38(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
hk2najs5beg_39(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
hk2najs5beg_40(input) {
  if input is Number
    return "number"
  if (IsObject(input)) {
    if (input.Count() == input.Length()) {
      return "array"
    }
    return "object"
  }
  return "string"
}
hk2najs5beg_41(input) {
  _type := $.type.Call(input)
  switch _type {
    case "array": {
      return input.Length()
    }
    case "object": {
      return input.Count()
    }
    case "string": {
      return StrLen(input)
    }
    default: {
      throw Exception("$.length: invalid type '" . (_type) . "'")
    }
  }
}
hk2najs5beg_42(input, needle) {
  _type := $.type.Call(input)
  if (_type == "string" || _type == "number") {
    return (InStr(input, needle)) > 0
  }
  if (_type == "array") {
    for __i__, it in input {
      if (it == needle) {
        return true
      }
    }
    return false
  }
  throw Exception("$.includes: invalid type '" . (_type) . "'")
}
hk2najs5beg_43(input) {
  _type := $.type.Call(input)
  if !(_type == "array") {
    throw Exception("$.reverse: invalid type '" . (_type) . "'")
  }
  _len := $.length.Call(input)
  _output := []
  for i, key in input {
    _output[_len - i + 1] := key
  }
  return _output
}

global bind := Func("e6b36vhfmkg_29")
global $dataDoAs := {count: 0, fn: "", interval: 0, limit: 1}
global doAs := Func("e6b36vhfmkg_11")
global id := "" ; variable
global isSuspend := false
global timer := ""
global init := Func("e6b36vhfmkg_9") ; function
global watch := Func("e6b36vhfmkg_8")
$.on.Call("f1", init) ; binding
$.on.Call("alt + f4", "e6b36vhfmkg_7")
global isJumping := false
global timerJump := ""
global jumpTwice := Func("e6b36vhfmkg_6")
global startJumpBack := Func("e6b36vhfmkg_4")
global stopJumpBack := Func("e6b36vhfmkg_3")
global tsViewFar := 0
global viewFar := Func("e6b36vhfmkg_2")
e6b36vhfmkg_1() {
  $.click.Call("wheel-down:up")
}
e6b36vhfmkg_2() {
  if !($.now.Call() - tsViewFar > 2000) {
    return
  }
  tsViewFar := $.now.Call()
  $.click.Call("wheel-down:down")
  setTimeout.Call("e6b36vhfmkg_1", 500)
}
e6b36vhfmkg_3() {
  if !(isJumping) {
    return
  }
  isJumping := false
  clearTimeout.Call(timerJump)
}
e6b36vhfmkg_4() {
  if (isJumping) {
    return
  }
  isJumping := true
  timerJump := setTimeout.Call(jumpTwice, 100)
}
e6b36vhfmkg_5() {
  $.press.Call("space")
}
e6b36vhfmkg_6() {
  $.press.Call("space")
  doAs.Call("e6b36vhfmkg_5", 100, 2, 200)
}
e6b36vhfmkg_7() {
  $.beep.Call()
  $.exit.Call()
}
e6b36vhfmkg_8() {
  if (!isSuspend && !WinActive("ahk_id " . (id) . "")) {
    $.suspend.Call(true)
    isSuspend := true
    return
  }
  if (isSuspend && WinActive("ahk_id " . (id) . "")) {
    $.suspend.Call(false)
    isSuspend := false
    return
  }
}
e6b36vhfmkg_9() {
  id := WinExist("A")
  $.off.Call("f1", init)
  bind.Call()
  setInterval.Call(watch, 200)
  $.beep.Call()
}
e6b36vhfmkg_10() {
  doAs.Call()
}
e6b36vhfmkg_11(fn := "", interval := 100, limit := 1, delay := 0) {
  if (fn) {
    $dataDoAs.count := 0
    $dataDoAs.fn := fn
    $dataDoAs.interval := interval
    $dataDoAs.limit := limit
  }
  if (delay) {
    setTimeout.Call(doAs, delay)
    return
  }
  if ($dataDoAs.count >= $dataDoAs.limit) {
    return
  }
  $dataDoAs.count++
  (Func($dataDoAs.fn)).Call($dataDoAs)
  setTimeout.Call("e6b36vhfmkg_10", $dataDoAs.interval)
}
e6b36vhfmkg_12() {
  $.press.Call("w:up")
}
e6b36vhfmkg_13() {
  $.press.Call("w:down")
  viewFar.Call()
}
e6b36vhfmkg_14() {
  jumpTwice.Call()
}
e6b36vhfmkg_15() {
  $.press.Call("s:up")
  stopJumpBack.Call()
}
e6b36vhfmkg_16() {
  $.press.Call("s:down")
  startJumpBack.Call()
}
e6b36vhfmkg_17(e) {
  $.press.Call("f")
  if !(e.count >= 10) {
    $.click.Call("wheel-down:down")
  } else {
    $.press.Call("wheel-down:up")
  }
}
e6b36vhfmkg_18() {
  doAs.Call("e6b36vhfmkg_17", 100, 10)
}
e6b36vhfmkg_19() {
  $.press.Call("e")
}
e6b36vhfmkg_20() {
  $.press.Call("5")
  doAs.Call("e6b36vhfmkg_19", 100, 2, 100)
}
e6b36vhfmkg_21() {
  $.press.Call("e")
}
e6b36vhfmkg_22() {
  $.press.Call("4")
  doAs.Call("e6b36vhfmkg_21", 100, 2, 100)
}
e6b36vhfmkg_23() {
  $.press.Call("e")
}
e6b36vhfmkg_24() {
  $.press.Call("3")
  doAs.Call("e6b36vhfmkg_23", 100, 2, 100)
}
e6b36vhfmkg_25() {
  $.press.Call("e")
}
e6b36vhfmkg_26() {
  $.press.Call("2")
  doAs.Call("e6b36vhfmkg_25", 100, 2, 100)
}
e6b36vhfmkg_27() {
  $.press.Call("e")
}
e6b36vhfmkg_28() {
  $.press.Call("1")
  doAs.Call("e6b36vhfmkg_27", 100, 2, 100)
}
e6b36vhfmkg_29() {
  $.on.Call("1", "e6b36vhfmkg_28")
  $.on.Call("2", "e6b36vhfmkg_26")
  $.on.Call("3", "e6b36vhfmkg_24")
  $.on.Call("4", "e6b36vhfmkg_22")
  $.on.Call("5", "e6b36vhfmkg_20")
  $.on.Call("f", "e6b36vhfmkg_18")
  $.on.Call("s", "e6b36vhfmkg_16")
  $.on.Call("s:up", "e6b36vhfmkg_15")
  $.on.Call("space", "e6b36vhfmkg_14")
  $.on.Call("w", "e6b36vhfmkg_13")
  $.on.Call("w:up", "e6b36vhfmkg_12")
}
