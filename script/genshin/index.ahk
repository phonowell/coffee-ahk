if (A_IsAdmin != true) {
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
$.reverse := Func("anonymous_56") ; reverse(input: unknown[]): unknown[]
$.includes := Func("anonymous_55")
$.length := Func("anonymous_54") ; length(input: string | array | object): number
$.type := Func("anonymous_53") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("anonymous_52") ; findColor( color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation = 0 ): Point
$.findImage := Func("anonymous_51") ; findImage( source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], ): Point
$.getColor := Func("anonymous_50") ; getColor(point?: Point): number
$.getPosition := Func("anonymous_49") ; getPosition(): Point
$.getState := Func("anonymous_48") ; getState(key: string): string
$.formatHotkey := Func("anonymous_47") ; formatHotkey(key: string): string
$.now := Func("anonymous_46") ; now(): number
$.random := Func("anonymous_45") ; random(min: number = 0, max: number = 1): number
$.click := Func("anonymous_44") ; click(key?: string): void
$.move := Func("anonymous_43") ; move(point: Point, speed: number = 0): void
$.press := Func("anonymous_42") ; press(key...: string): void
$.setFixed := Func("anonymous_41") ; setFixed(fixed?: boolean): void
$.beep := Func("anonymous_40") ; beep(): void
$.info := Func("anonymous_39") ; info(message: string, point?: Point): string
$.replace := Func("anonymous_38") ; replace( input: string, searchment: string, replacement: string, limit: number = -1 )
$.split := Func("anonymous_37") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("anonymous_36") ; toLowerCase(input: string): string
$.toString := Func("anonymous_35") ; toString(input: unknown): string
$.toUpperCase := Func("anonymous_34") ; toUpperCase(input: string): string
$.trim := Func("anonymous_33") ; trim(input: string, omitting: string): string
$.trimEnd := Func("anonymous_32") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("anonymous_31") ; trimStart(input: string, omitting: string): string
$.exit := Func("anonymous_30") ; exit(): void
$.off := Func("anonymous_29") ; off(key: string, fn: Function | string): void
$.on := Func("anonymous_28") ; on(key, string, fn: Function | string): void
$.open := Func("anonymous_27") ; open(source: string): void
$.pause := Func("anonymous_26") ; pause(paused?: boolean): void
$.reload := Func("anonymous_25") ; reload(): void
$.sleep := Func("anonymous_24") ; sleep(time: number): void
global Math := {abs: Func("anonymous_23"), ceil: Func("anonymous_22"), floor: Func("anonymous_21"), round: Func("anonymous_20")} ; abs(n: number): number ceil(n: number): number floor(n: number): number round(n: number): number
global alert := Func("anonymous_19") ; alert(message: string): string
global clearInterval := Func("anonymous_18") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("anonymous_17") ; clearTimeout(fn: Function | string): void
global setInterval := Func("anonymous_16") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("anonymous_15") ; setTimeout(fn: Function | string, time: number): string
global timer := "" ; variable
global dataAct := [1, 5] ; function
global act := Func("anonymous_14")
global jump := Func("anonymous_12")
global dataPick := [1, 10]
global pick := Func("anonymous_11")
$.on.Call("alt + f4", "anonymous_9") ; binding
$.on.Call("f12", "anonymous_8")
$.on.Call("1", "anonymous_7")
$.on.Call("2", "anonymous_6")
$.on.Call("3", "anonymous_5")
$.on.Call("4", "anonymous_4")
$.on.Call("5", "anonymous_3")
$.on.Call("f", "anonymous_2")
$.on.Call("space", "anonymous_1")
anonymous_1() {
  clearTimeout.Call(timer)
  jump.Call()
  timer := setTimeout.Call(jump, 200)
}
anonymous_2() {
  pick.Call()
}
anonymous_3() {
  $.press.Call("5")
  act.Call()
}
anonymous_4() {
  $.press.Call("4")
  act.Call()
}
anonymous_5() {
  $.press.Call("3")
  act.Call()
}
anonymous_6() {
  $.press.Call("2")
  act.Call()
}
anonymous_7() {
  $.press.Call("1")
  act.Call()
}
anonymous_8() {
  $.beep.Call()
  $.pause.Call()
}
anonymous_9() {
  $.beep.Call()
  $.exit.Call()
}
anonymous_10() {
  pick.Call()
}
anonymous_11() {
  if (dataPick[1] > dataPick[2]) {
    dataPick[1] := 1
    $.press.Call("f")
    $.click.Call("wheel-down:up")
    return
  }
  dataPick[1]++
  $.press.Call("f")
  $.click.Call("wheel-down:down")
  setTimeout.Call("anonymous_10", 100)
}
anonymous_12() {
  $.press.Call("space")
}
anonymous_13() {
  act.Call()
}
anonymous_14() {
  if (dataAct[1] > dataAct[2]) {
    dataAct[1] := 1
    $.press.Call("e")
    return
  }
  dataAct[1]++
  $.press.Call("e")
  setTimeout.Call("anonymous_13", 100)
}
anonymous_15(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
anonymous_16(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
anonymous_17(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
anonymous_18(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
anonymous_19(message := "") {
  if !(message) {
    return
  }
  msg := $.toString.Call(message)
  MsgBox, % msg
  return message
}
anonymous_20(n) {
  return Round(n)
}
anonymous_21(n) {
  return Floor(n)
}
anonymous_22(n) {
  return Ceil(n)
}
anonymous_23(n) {
  return Abs(n)
}
anonymous_24(time) {
  Sleep, % time
}
anonymous_25() {
  Reload
}
anonymous_26(isPaused := "Toggle") {
  if (isPaused != "Toggle") {
    if (isPaused) {
      isPaused := "On"
    } else {
      isPaused := "Off"
    }
  }
  Pause, % isPaused
}
anonymous_27(source) {
  Run, % source
}
anonymous_28(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
anonymous_29(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
anonymous_30() {
  ExitApp
}
anonymous_31(input, omitting := " `t") {
  return LTrim(input, omitting)
}
anonymous_32(input, omitting := " `t") {
  return RTrim(input, omitting)
}
anonymous_33(input, omitting := " `t") {
  return Trim(input, omitting)
}
anonymous_34(input) {
  StringUpper, __Result__, input
  return __Result__
}
anonymous_35(input) {
  type := $.type.Call(input)
  if (type == "array") {
    result := ""
    for __i__, key in input {
      result := "" . (result) . ", " . ($.toString.Call(key)) . ""
    }
    return "[" . ($.trim.Call(result, " ,")) . "]"
  } else if (type == "object") {
    result := ""
    for key, value in input {
      result := "" . (result) . ", " . (key) . ": " . ($.toString.Call(value)) . ""
    }
    return "{" . ($.trim.Call(result, " ,")) . "}"
  }
  return input
}
anonymous_36(input) {
  StringLower, __Result__, input
  return __Result__
}
anonymous_37(input, delimiter) {
  return StrSplit(input, delimiter)
}
anonymous_38(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
anonymous_39(message, point := "") {
  if !(message) {
    return
  }
  if !(point) {
    point := $.getPosition.Call()
  }
  msg := $.toString.Call(message)
  ToolTip, % msg, % point[1], % point[2]
  return message
}
anonymous_40() {
  SoundBeep
}
anonymous_41(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
anonymous_42(listInput*) {
  if !($.length.Call(listInput)) { ; validate
    throw Exception("$.press: invalid key")
  }
  listKey := [] ; format
  for __i__, input in listInput {
    _input := $.toLowerCase.Call(input)
    _input := $.replace.Call(_input, " ", "")
    _input := $.replace.Call(_input, "-", "")
    _list := $.split.Call(_input, "+")
    for __i__, _it in _list {
      listKey.Push(_it)
    }
  }
  listResult := [] ; unfold
  len := $.length.Call(listKey)
  for i, key in listKey {
    if (i == len) { ; last
      listResult[i] := $.split.Call(key, ":")
      continue
    }
    if ($.includes.Call(key, ":")) { ; other
      listResult[i] := $.split.Call(key, ":")
      listResult[len * 2 - i] := $.split.Call(key, ":")
    } else {
      listResult[i] := [key, "down"]
      listResult[len * 2 - i] := [key, "up"]
    }
  }
  for i, it in listResult {
    if (it[1] == "win") {
      it[1] := "lwin"
    }
    listResult[i] := $.trim.Call("" . (it[1]) . " " . (it[2]) . "")
  }
  output := "" ; execute
  for __i__, it in listResult {
    output := "" . (output) . "{" . (it) . "}"
  }
  Send, % output
}
anonymous_43(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
anonymous_44(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
anonymous_45(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
anonymous_46() {
  return A_TickCount
}
anonymous_47(key) {
  listKey := [] ; format
  _key := $.toLowerCase.Call(key)
  _key := $.replace.Call(_key, " ", "")
  _key := $.replace.Call(_key, "-", "")
  _list := $.split.Call(_key, "+")
  for __i__, _it in _list {
    listKey.Push(_it)
  }
  isAlt := false ; unfold
  isCtrl := false
  isShift := false
  isWin := false
  listResult := []
  for __i__, key in listKey {
    if (key == "alt") {
      isAlt := true
      continue
    }
    if (key == "ctrl") {
      isCtrl := true
      continue
    }
    if (key == "shift") {
      isShift := true
      continue
    }
    if (key == "win") {
      isWin := true
      continue
    }
    listResult.Push(key)
  }
  prefix := ""
  if (isAlt) {
    prefix := "" . (prefix) . "!"
  }
  if (isCtrl) {
    prefix := "" . (prefix) . "^"
  }
  if (isShift) {
    prefix := "" . (prefix) . "+"
  }
  if (isWin) {
    prefix := "" . (prefix) . "#"
  }
  result := ""
  for __i__, it in listResult {
    result := "" . (result) . " & " . (it) . ""
  }
  return $.replace.Call("" . (prefix) . "" . ($.trim.Call(result, " &")) . "", ":", " ")
}
anonymous_48(key) {
  return GetKeyState(key)
}
anonymous_49() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
anonymous_50(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
anonymous_51(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
anonymous_52(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
anonymous_53(input) {
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
anonymous_54(input) {
  type := $.type.Call(input)
  switch type {
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
      throw Exception("$.length: invalid type '" . (type) . "'")
    }
  }
}
anonymous_55(input, needle) {
  type := $.type.Call(input)
  if (type == "string" || type == "number") {
    return (InStr(input, needle)) > 0
  }
  if (type == "array") {
    for __i__, it in input {
      if (it == needle) {
        return true
      }
    }
    return false
  }
  throw Exception("$.includes: invalid type '" . (type) . "'")
}
anonymous_56(input) {
  type := $.type.Call(input)
  if !(type == "array") {
    throw Exception("$.reverse: invalid type '" . (type) . "'")
  }
  len := $.length.Call(input)
  output := []
  for i, key in input {
    output[len - i + 1] := key
  }
  return output
}
