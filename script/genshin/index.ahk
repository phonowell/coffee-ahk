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
class MathToolkit {
  abs(n) { ; abs(n: number): number
    return Abs(n)
  }
  ceil(n) { ; ceil(n: number): number
    return Ceil(n)
  }
  floor(n) { ; floor(n: number): number
    return Floor(n)
  }
  round(n) { ; round(n: number): number
    return Round(n)
  }
}
global Math := new MathToolkit()
clearInterval(fn) { ; clearInterval(fn: Function | string): void
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
clearTimeout(fn) { ; clearTimeout(fn: Function | string): void
  if !(fn) {
    return
  }
  SetTimer, % fn, Delete
}
setInterval(fn, time := 0) { ; setInterval(fn: Function | string, time: number): string
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % time
  return fn
}
setTimeout(fn, time := 0) { ; setTimeout(fn: Function | string, time: number): string
  if !(fn) {
    return fn
  }
  SetTimer, % fn, % 0 - time
  return fn
}
class ArrayToolkit {
  reverse(input := "") { ; reverse(input: unknown[]): unknown[]
    type := $.type(input)
    if !(type == "array") {
      throw Exception("$.reverse: invalid type '" . (type) . "'")
    }
    len := $.length(input)
    output := []
    for i, key in input {
      output[len - i + 1] := key
    }
    return output
  }
}
class BasicToolkit extends ArrayToolkit {
  includes(input, needle) { ; includes(input: string | array, needle: string): boolean
    type := $.type(input)
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
  length(input) { ; length(input: string | array | object): number
    type := $.type(input)
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
  type(input) { ; type(input: unknown): 'array' | 'number' | 'object' | 'string'
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
}
class FinderToolkit extends BasicToolkit {
  findColor(color := "", start := "", end := "", variation := 0) { ; findColor( ; color: number, ; start: Point = [0, 0], ; end: Point = [A_ScreenWidth, A_ScreenHeight], ; variation = 0 ; ): Point
    if !(color) {
      throw Exception("$.findColor: invalid color")
    }
    if !(start) {
      start := [0, 0]
    }
    if !(end) {
      end := [A_ScreenWidth, A_ScreenHeight]
    }
    PixelSearch __X__, __Y__, start[1], start[2], end[1], end[2], color, variation, Fast RGB
    return [__X__, __Y__]
  }
  findImage(source := "", start := "", end := "") { ; findImage( ; source: string, ; start: Point = [0, 0], ; end: Point = [A_ScreenWidth, A_ScreenHeight], ; ): Point
    if !(source) {
      throw Exception("$.findImage: invalid source")
    }
    if !(start) {
      start := [0, 0]
    }
    if !(end) {
      end := [A_ScreenWidth, A_ScreenHeight]
    }
    ImageSearch __x__, __Y__, start[1], start[2], end[1], end[2], % A_ScriptDir . "\\\" . source
    return [__X__, __Y__]
  }
}
class GetterToolkit extends FinderToolkit {
  getColor(point := "") { ; getColor(point?: Point): number
    if !(point) {
      point := $.getPosition()
    }
    PixelGetColor, __Result__, % point[1], % point[2], RGB
    return __Result__
  }
  getPosition() { ; getPosition(): Point
    MouseGetPos, __X__, __Y__
    return [__X__, __Y__]
  }
  getState(key) { ; getState(key: string): string
    return GetKeyState(key)
  }
}
class OtherToolkit extends GetterToolkit {
  formatHotkey(key := "") { ; formatHotkey(key: string): string
    if !(key) { ; validate
      throw Exception("$.formatHotkey: invalid key")
    }
    listKey := [] ; format
    _key := $.toLowerCase(key)
    _key := $.replace(_key, " ", "")
    _key := $.replace(_key, "-", "")
    _list := $.split(_key, "+")
    for __i__, _it in _list {
      listKey.push(_it)
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
      listResult.push(key)
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
    return $.replace("" . (prefix) . "" . ($.trim(result, " &")) . "", ":", " ")
  }
  now() { ; now(): number
    return A_TickCount
  }
  random(min := 0, max := 1) { ; random(min: number = 0, max: number = 1): number
    Random, __Result__, min, max
    return __Result__
  }
}
class SetterToolkit extends OtherToolkit {
  click(key := "") { ; click(key?: string): void
    if !(key) {
      Click
      return
    }
    key := $.replace(key, "-", "")
    key := $.replace(key, ":", " ")
    Click, % key
  }
  move(point := "", speed := 0) { ; move(point: Point, speed: number = 0): void
    if !(point) {
      throw Exception("$.move: invalid point")
    }
    MouseMove, point[1], point[2], speed
  }
  press(listInput*) { ; press(key...: string): void
    if !($.length(listInput)) { ; validate
      throw Exception("$.press: invalid key")
    }
    listKey := [] ; format
    for __i__, input in listInput {
      _input := $.toLowerCase(input)
      _input := $.replace(_input, " ", "")
      _input := $.replace(_input, "-", "")
      _list := $.split(_input, "+")
      for __i__, _it in _list {
        listKey.push(_it)
      }
    }
    listResult := [] ; unfold
    len := $.length(listKey)
    for i, key in listKey {
      if (i == len) { ; last
        listResult[i] := $.split(key, ":")
        continue
      }
      if ($.includes(key, ":")) { ; other
        listResult[i] := $.split(key, ":")
        listResult[len * 2 - i] := $.split(key, ":")
      } else {
        listResult[i] := [key, "down"]
        listResult[len * 2 - i] := [key, "up"]
      }
    }
    for i, it in listResult {
      if (it[1] == "win") {
        it[1] := "lwin"
      }
      listResult[i] := $.trim("" . (it[1]) . " " . (it[2]) . "")
    }
    output := "" ; execute
    for __i__, it in listResult {
      output := "" . (output) . "{" . (it) . "}"
    }
    Send, % output
  }
  setFixed(isFixed := "Toggle") { ; setFixed(fixed?: boolean): void
    if (isFixed != "Toggle") {
      if (isFixed) {
        isFixed := "On"
      } else {
        isFixed := "Off"
      }
    }
    Winset AlwaysOnTop, % isFixed, A
  }
}
class SpeakerToolkit extends SetterToolkit {
  alert(message := "") { ; alert(message: string): string
    if !(message) {
      return
    }
    msg := $.toString(message)
    MsgBox, % msg
    return message
  }
  beep() { ; beep(): void
    SoundBeep
  }
  info(message := "", point := "") { ; info(message: string, point?: Point): string
    if !(message) {
      return
    }
    if !(point) {
      point := $.getPosition()
    }
    msg := $.toString(message)
    ToolTip, % msg, % point[1], % point[2]
    return message
  }
}
class StringToolkit extends SpeakerToolkit {
  replace(input, searchment, replacement, limit := -1) { ; replace( ; input: string, ; searchment: string, ; replacement: string, ; limit: number = -1 ; )
    return StrReplace(input, searchment, replacement, limit)
  }
  split(input, delimiter) { ; split(input: string, delimiter: string): string
    return StrSplit(input, delimiter)
  }
  toLowerCase(input) { ; toLowerCase(input: string): string
    StringLower, __Result__, input
    return __Result__
  }
  toString(input) { ; toString(input: unknown): string
    type := $.type(input)
    if (type == "array") {
      result := ""
      for __i__, key in input {
        result := "" . (result) . ", " . ($.toString(key)) . ""
      }
      return "[" . ($.trim(result, " ,")) . "]"
    } else if (type == "object") {
      result := ""
      for key, value in input {
        result := "" . (result) . ", " . (key) . ": " . ($.toString(value)) . ""
      }
      return "{" . ($.trim(result, " ,")) . "}"
    }
    return input
  }
  toUpperCase(input) { ; toUpperCase(input: string): string
    StringUpper, __Result__, input
    return __Result__
  }
  trim(input, omitting := " `t") { ; trim(input: string, omitting: string): string
    return Trim(input, omitting)
  }
  trimEnd(input, omitting := " `t") { ; trimEnd(input: string, omitting: string): string
    return RTrim(input, omitting)
  }
  trimStart(input, omitting := " `t") { ; trimStart(input: string, omitting: string): string
    return LTrim(input, omitting)
  }
}
class SystemToolkit extends StringToolkit {
  exit() { ; exit(): void
    ExitApp
  }
  off(key, fn) { ; off(key: string, fn: Function | string): void
    key := $.formatHotkey(key)
    Hotkey, % key, % fn, Off
  }
  on(key, fn) { ; on(key, string, fn: Function | string): void
    key := $.formatHotkey(key)
    Hotkey, % key, % fn, On
  }
  open(source := "") { ; open(source: string): void
    if !(source) {
      throw Exception("$.open: invalid source")
    }
    Run, % source
  }
  pause(isPaused := "Toggle") { ; pause(paused?: boolean): void
    if (isPaused != "Toggle") {
      if (isPaused) {
        isPaused := "On"
      } else {
        isPaused := "Off"
      }
    }
    Pause, % isPaused
  }
  reload() { ; reload(): void
    Reload
  }
  sleep(time) { ; sleep(time: number): void
    Sleep, % time
  }
}
class Toolkit extends SystemToolkit {
  version := "0.0.1"
}
global $ := new Toolkit()

global isPicking := false ; variable
global stepPick := 0
global timer := ""
jump() { ; function
  $.press("space")
}
useE() {
  $.press("e")
}
$.on("alt + f4", "anonymous_19") ; binding
$.on("f12", "anonymous_18")
$.on("1", "anonymous_17")
$.on("2", "anonymous_16")
$.on("3", "anonymous_15")
$.on("4", "anonymous_14")
$.on("5", "anonymous_13")
$.on("f", "anonymous_12")
$.on("space", "anonymous_1")
anonymous_1() {
  clearTimeout(timer)
  jump()
  timer := setTimeout("jump", 200)
}
anonymous_2() {
  $.press("f")
  $.click("wheel-down:up")
}
anonymous_3() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_4() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_5() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_6() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_7() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_8() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_9() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_10() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_11() {
  $.press("f")
  $.click("wheel-down:down")
}
anonymous_12() {
  $.press("f")
  $.click("wheel-down:down")
  setTimeout("anonymous_11", 100)
  setTimeout("anonymous_10", 200)
  setTimeout("anonymous_9", 300)
  setTimeout("anonymous_8", 400)
  setTimeout("anonymous_7", 500)
  setTimeout("anonymous_6", 600)
  setTimeout("anonymous_5", 700)
  setTimeout("anonymous_4", 800)
  setTimeout("anonymous_3", 900)
  setTimeout("anonymous_2", 1000)
}
anonymous_13() {
  clearTimeout(timer)
  $.press("5")
  timer := setTimeout("useE", 100)
}
anonymous_14() {
  clearTimeout(timer)
  $.press("4")
  timer := setTimeout("useE", 100)
}
anonymous_15() {
  clearTimeout(timer)
  $.press("3")
  timer := setTimeout("useE", 100)
}
anonymous_16() {
  clearTimeout(timer)
  $.press("2")
  timer := setTimeout("useE", 100)
}
anonymous_17() {
  clearTimeout(timer)
  $.press("1")
  timer := setTimeout("useE", 100)
}
anonymous_18() {
  $.beep()
  $.pause()
}
anonymous_19() {
  $.beep()
  $.exit()
}
