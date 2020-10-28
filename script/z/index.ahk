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
$.reverse := Func("madsjf79g38_42") ; reverse(input: unknown[]): unknown[]
$.includes := Func("madsjf79g38_41")
$.length := Func("madsjf79g38_40") ; length(input: string | array | object): number
$.type := Func("madsjf79g38_39") ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.findColor := Func("madsjf79g38_38") ; findColor( color: number, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], variation = 0 ): Point
$.findImage := Func("madsjf79g38_37") ; findImage( source: string, start: Point = [0, 0], end: Point = [A_ScreenWidth, A_ScreenHeight], ): Point
$.getColor := Func("madsjf79g38_36") ; getColor(point?: Point): number
$.getPosition := Func("madsjf79g38_35") ; getPosition(): Point
$.getState := Func("madsjf79g38_34") ; getState(key: string): string
$.formatHotkey := Func("madsjf79g38_33") ; formatHotkey(key: string): string
$.now := Func("madsjf79g38_32") ; now(): number
$.random := Func("madsjf79g38_31") ; random(min: number = 0, max: number = 1): number
$.click := Func("madsjf79g38_30") ; click(key?: string): void
$.move := Func("madsjf79g38_29") ; move(point: Point, speed: number = 0): void
$.press := Func("madsjf79g38_28") ; press(key...: string): void
$.setFixed := Func("madsjf79g38_27") ; setFixed(fixed?: boolean): void
$.beep := Func("madsjf79g38_26") ; beep(): void
$.info := Func("madsjf79g38_25") ; info(message: string, point?: Point): string
$.replace := Func("madsjf79g38_24") ; replace( input: string, searchment: string, replacement: string, limit: number = -1 )
$.split := Func("madsjf79g38_23") ; split(input: string, delimiter: string): string
$.toLowerCase := Func("madsjf79g38_22") ; toLowerCase(input: string): string
$.toString := Func("madsjf79g38_21") ; toString(input: unknown): string
$.toUpperCase := Func("madsjf79g38_20") ; toUpperCase(input: string): string
$.trim := Func("madsjf79g38_19") ; trim(input: string, omitting: string): string
$.trimEnd := Func("madsjf79g38_18") ; trimEnd(input: string, omitting: string): string
$.trimStart := Func("madsjf79g38_17") ; trimStart(input: string, omitting: string): string
$.exit := Func("madsjf79g38_16") ; exit(): void
$.off := Func("madsjf79g38_15") ; off(key: string, fn: Function | string): void
$.on := Func("madsjf79g38_14") ; on(key, string, fn: Function | string): void
$.open := Func("madsjf79g38_13") ; open(source: string): void
$.pause := Func("madsjf79g38_12") ; pause(paused?: boolean): void
$.reload := Func("madsjf79g38_11") ; reload(): void
$.sleep := Func("madsjf79g38_10") ; sleep(time: number): void
global Math := {abs: Func("madsjf79g38_9"), ceil: Func("madsjf79g38_8"), floor: Func("madsjf79g38_7"), round: Func("madsjf79g38_6")} ; abs(n: number): number ceil(n: number): number floor(n: number): number round(n: number): number
global alert := Func("madsjf79g38_5") ; alert(message: string): string
global clearInterval := Func("madsjf79g38_4") ; clearInterval(fn: Function | string): void
global clearTimeout := Func("madsjf79g38_3") ; clearTimeout(fn: Function | string): void
global setInterval := Func("madsjf79g38_2") ; setInterval(fn: Function | string, time: number): string
global setTimeout := Func("madsjf79g38_1") ; setTimeout(fn: Function | string, time: number): string
madsjf79g38_1(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
madsjf79g38_2(fn, time := 0) {
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
madsjf79g38_3(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
madsjf79g38_4(fn) {
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
madsjf79g38_5(message := "") {
  if !(message) {
    return
  }
  msg := $.toString.Call(message)
  MsgBox, % msg
  return message
}
madsjf79g38_6(n) {
  return Round(n)
}
madsjf79g38_7(n) {
  return Floor(n)
}
madsjf79g38_8(n) {
  return Ceil(n)
}
madsjf79g38_9(n) {
  return Abs(n)
}
madsjf79g38_10(time) {
  Sleep, % time
}
madsjf79g38_11() {
  Reload
}
madsjf79g38_12(isPaused := "Toggle") {
  if (isPaused != "Toggle") {
    if (isPaused) {
      isPaused := "On"
    } else {
      isPaused := "Off"
    }
  }
  Pause, % isPaused
}
madsjf79g38_13(source) {
  Run, % source
}
madsjf79g38_14(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, On
}
madsjf79g38_15(key, fn) {
  key := $.formatHotkey.Call(key)
  Hotkey, % key, % fn, Off
}
madsjf79g38_16() {
  ExitApp
}
madsjf79g38_17(input, omitting := " `t") {
  return LTrim(input, omitting)
}
madsjf79g38_18(input, omitting := " `t") {
  return RTrim(input, omitting)
}
madsjf79g38_19(input, omitting := " `t") {
  return Trim(input, omitting)
}
madsjf79g38_20(input) {
  StringUpper, __Result__, input
  return __Result__
}
madsjf79g38_21(input) {
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
madsjf79g38_22(input) {
  StringLower, __Result__, input
  return __Result__
}
madsjf79g38_23(input, delimiter) {
  return StrSplit(input, delimiter)
}
madsjf79g38_24(input, searchment, replacement, limit := -1) {
  return StrReplace(input, searchment, replacement, limit)
}
madsjf79g38_25(message, point := "") {
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
madsjf79g38_26() {
  SoundBeep
}
madsjf79g38_27(isFixed := "Toggle") {
  if (isFixed != "Toggle") {
    if (isFixed) {
      isFixed := "On"
    } else {
      isFixed := "Off"
    }
  }
  Winset AlwaysOnTop, % isFixed, A
}
madsjf79g38_28(listInput*) {
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
madsjf79g38_29(point := "", speed := 0) {
  if !(point) {
    throw Exception("$.move: invalid point")
  }
  MouseMove, point[1], point[2], speed
}
madsjf79g38_30(key := "left") {
  key := $.replace.Call(key, "-", "")
  key := $.replace.Call(key, ":", " ")
  Click, % key
}
madsjf79g38_31(min := 0, max := 1) {
  Random, __Result__, min, max
  return __Result__
}
madsjf79g38_32() {
  return A_TickCount
}
madsjf79g38_33(key) {
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
madsjf79g38_34(key) {
  return GetKeyState(key)
}
madsjf79g38_35() {
  MouseGetPos, __X__, __Y__
  return [__X__, __Y__]
}
madsjf79g38_36(point := "") {
  if !(point) {
    point := $.getPosition.Call()
  }
  PixelGetColor, __Result__, % point[1], % point[2], RGB
  return __Result__
}
madsjf79g38_37(source, start := "", end := "") {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
  return [__X__, __Y__]
}
madsjf79g38_38(color, start := "", end := "", variation := 0) {
  if !(start) {
    start := [0, 0]
  }
  if !(end) {
    end := [A_ScreenWidth, A_ScreenHeight]
  }
  PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
  return [__X__, __Y__]
}
madsjf79g38_39(input) {
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
madsjf79g38_40(input) {
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
madsjf79g38_41(input, needle) {
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
madsjf79g38_42(input) {
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

global timer := ""
$.on.Call("win + n", "0envgi3t9n4_4")
$.on.Call("esc", "0envgi3t9n4_2")
$.on.Call("alt + f4", "0envgi3t9n4_1")
0envgi3t9n4_1() {
  $.exit.Call()
}
0envgi3t9n4_2() {
  clearTimeout.Call(timer)
}
0envgi3t9n4_3() {
  $.open.Call("notepad.exe")
}
0envgi3t9n4_4() {
  clearTimeout.Call(timer)
  timer := setTimeout.Call("0envgi3t9n4_3", 1000)
}
