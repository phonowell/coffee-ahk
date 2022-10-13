global __ci_ahk__ := Func("ahk_52")
global __ahk_module_4__ := (Func("ahk_51")).Call()
global __ahk_module_5__ := (Func("ahk_49")).Call()
global __ahk_module_12__ := (Func("ahk_47")).Call()
global __ahk_module_13__ := (Func("ahk_45")).Call()
global __ahk_module_14__ := (Func("ahk_43")).Call()
global __ahk_module_15__ := (Func("ahk_41")).Call()
global __ahk_module_16__ := (Func("ahk_39")).Call()
global __ahk_module_17__ := (Func("ahk_37")).Call()
global __ahk_module_1__ := (Func("ahk_35")).Call()
global __ahk_module_2__ := (Func("ahk_33")).Call()
global __ahk_module_8__ := (Func("ahk_31")).Call()
global __ahk_module_18__ := (Func("ahk_30")).Call()
global __ahk_module_19__ := (Func("ahk_28")).Call()
global __ahk_module_20__ := (Func("ahk_26")).Call()
global __ahk_module_10__ := (Func("ahk_24")).Call()
global __ahk_module_11__ := (Func("ahk_22")).Call()
global __ahk_module_7__ := (Func("ahk_20")).Call()
global __ahk_module_9__ := (Func("ahk_18")).Call()
global $filter := __ahk_module_7__
global $forEach := __ahk_module_8__
global $formatHotkey := __ahk_module_9__
global $length := __ahk_module_10__
global $noop := __ahk_module_5__
global $push := __ahk_module_11__
global $replace := __ahk_module_12__
global $split := __ahk_module_13__
class KeyBindingShell {
  mapBound := {}
  mapCallback := {}
  add := Func("ahk_14").Bind(this)
  fire := Func("ahk_13").Bind(this)
  init := Func("ahk_10").Bind(this)
  off := Func("ahk_8").Bind(this)
  on := Func("ahk_7").Bind(this)
  remove := Func("ahk_6").Bind(this)
}
$noop.Call(KeyBindingShell)
global __ahk_module_6__ := (Func("ahk_4")).Call()
global __ahk_module_3__ := (Func("ahk_3")).Call()
global $admin := __ahk_module_1__
global $alert := __ahk_module_2__
global $on := __ahk_module_3__
global $exit := __ahk_module_4__
$admin.Call()
$on.Call("f1", Func("ahk_2"))
$on.Call("f2", Func("ahk_1"))
ahk_1() {
  return $exit.Call()
}
ahk_2() {
  return $alert.Call(1)
}
ahk_3() {
  $keyBindingShellX := __ahk_module_6__
  return $keyBindingShellX.add
}
ahk_4() {
  return new KeyBindingShell()
}
ahk_5($name, $item) {
  return $item[1] != $name
}
ahk_6(this, key) {
  __array__ := $split.Call(key, ".")
  key := __array__[1]
  $name := __array__[2]
  if !($name) {
    this.mapCallback[__ci_ahk__.Call(key)] := ""
    this.off.Call(key, this.mapBound[__ci_ahk__.Call(key)])
    return
  }
  $listNew := $filter.Call(this.mapCallback[__ci_ahk__.Call(key)], Func("ahk_5").Bind($name))
  if !($length.Call($listNew)) {
    this.mapCallback[__ci_ahk__.Call(key)] := ""
    this.off.Call(key, this.mapBound[__ci_ahk__.Call(key)])
    return
  }
  this.mapCallback[__ci_ahk__.Call(key)] := $listNew
  return
}
ahk_7(this, key, callback) {
  key := $formatHotkey.Call($replace.Call(key, ":down", ""))
  $noop.Call(callback)
  Hotkey, % key, % callback, On
  return
}
ahk_8(this, key, callback) {
  key := $formatHotkey.Call($replace.Call(key, ":down", ""))
  $noop.Call(callback)
  Hotkey, % key, % callback, Off
  return
}
ahk_9(key, this) {
  return this.fire.Call(key)
}
ahk_10(this, key) {
  if (this.mapCallback[__ci_ahk__.Call(key)]) {
    return
  }
  this.mapCallback[__ci_ahk__.Call(key)] := []
  $fn := Func("ahk_9").Bind(key, this)
  this.mapBound[__ci_ahk__.Call(key)] := $fn
  this.on.Call(key, $fn)
}
ahk_11(it) {
  return it[2].Call()
}
ahk_12($name, it) {
  return it[1] == $name
}
ahk_13(this, key) {
  __array__ := $split.Call(($replace.Call(key, ":down", "")), ".")
  key := __array__[1]
  $name := __array__[2]
  $list := this.mapCallback[__ci_ahk__.Call(key)]
  if ($name) {
    $list := $filter.Call($list, Func("ahk_12").Bind($name))
  }
  $forEach.Call($list, Func("ahk_11"))
}
ahk_14(this, key, callback) {
  __array__ := $split.Call(key, ".")
  key := __array__[1]
  $name := __array__[2]
  this.init.Call(key)
  $push.Call(this.mapCallback[__ci_ahk__.Call(key)], [$name, callback])
  return
}
ahk_15($formatKeyFormatHotkey, $pickPrefixFormatHotkey, $trim, key) {
  $listKey := $formatKeyFormatHotkey.Call(key)
  __array__ := $pickPrefixFormatHotkey.Call($listKey)
  $prefix := __array__[1]
  $listKey := __array__[2]
  $result := ""
  for __index_for__, $it in $listKey {
    $result := "" . ($result) . " & " . ($it) . ""
  }
  return $replace.Call("" . ($prefix) . "" . ($trim.Call($result, " &")) . "", ":", " ")
}
ahk_16(listKey) {
  if (($length.Call(listKey)) == 1) {
    return ["", listKey]
  }
  $prefix := ""
  $listNew := []
  for __index_for__, $key in listKey {
    if ($key == "alt") {
      $prefix := "" . ($prefix) . "!"
      continue
    }
    if ($key == "ctrl") {
      $prefix := "" . ($prefix) . "^"
      continue
    }
    if ($key == "shift") {
      $prefix := "" . ($prefix) . "+"
      continue
    }
    if ($key == "win") {
      $prefix := "" . ($prefix) . "#"
      continue
    }
    $push.Call($listNew, $key)
  }
  return [$prefix, $listNew]
}
ahk_17($toLowerCase, key) {
  $listKey := []
  $key := $toLowerCase.Call(key)
  $key := $replace.Call($key, " ", "")
  $key := $replace.Call($key, "-", "")
  $listSplit := $split.Call($key, "+")
  if ($length.Call($listSplit)) {
    $push.Call($listKey, $listSplit*)
  }
  return $listKey
}
ahk_18() {
  $length := __ahk_module_10__
  $push := __ahk_module_11__
  $replace := __ahk_module_12__
  $split := __ahk_module_13__
  $toLowerCase := __ahk_module_15__
  $trim := __ahk_module_16__
  $formatKeyFormatHotkey := Func("ahk_17").Bind($toLowerCase)
  $pickPrefixFormatHotkey := Func("ahk_16")
  return Func("ahk_15").Bind($formatKeyFormatHotkey, $pickPrefixFormatHotkey, $trim)
}
ahk_19(list, callback) {
  $listResult := []
  for $i, $item in list {
    $i := $i - 1
    if !(callback.Call($item, $i)) {
      continue
    }
    $push.Call($listResult, $item)
  }
  return $listResult
}
ahk_20() {
  $push := __ahk_module_11__
  return Func("ahk_19")
}
ahk_21($isArray, $getType, list, value*) {
  if !($isArray.Call(list)) {
    throw Exception("$.push: invalid type '" . ($getType.Call(list)) . "'")
  }
  for __index_for__, $v in value {
    list.Push($v)
  }
  return list.Length()
}
ahk_22() {
  $getType := __ahk_module_17__
  $isArray := __ahk_module_18__
  return Func("ahk_21").Bind($isArray, $getType)
}
ahk_23($isArray, $isObject, $isString, $getType, ipt) {
  if ($isArray.Call(ipt)) {
    return ipt.Length()
  }
  if ($isObject.Call(ipt)) {
    return ipt.Count()
  }
  if ($isString.Call(ipt)) {
    return StrLen(ipt)
  }
  throw Exception("$.length: invalid type '" . ($getType.Call(ipt)) . "'")
}
ahk_24() {
  $getType := __ahk_module_17__
  $isArray := __ahk_module_18__
  $isObject := __ahk_module_19__
  $isString := __ahk_module_20__
  return Func("ahk_23").Bind($isArray, $isObject, $isString, $getType)
}
ahk_25($getType, ipt) {
  $type := $getType.Call(ipt)
  if !($type == "string") {
    return false
  }
  return true
}
ahk_26() {
  $getType := __ahk_module_17__
  return Func("ahk_25").Bind($getType)
}
ahk_27($getType, ipt) {
  $type := $getType.Call(ipt)
  if !($type == "object") {
    return false
  }
  return true
}
ahk_28() {
  $getType := __ahk_module_17__
  return Func("ahk_27").Bind($getType)
}
ahk_29($getType, ipt) {
  $type := $getType.Call(ipt)
  if !($type == "array") {
    return false
  }
  return true
}
ahk_30() {
  $getType := __ahk_module_17__
  return Func("ahk_29").Bind($getType)
}
ahk_31() {
  $each := __ahk_module_14__
  return $each
}
ahk_32(message) {
  $noop.Call(message)
  MsgBox, % message
  return
}
ahk_33() {
  $noop := __ahk_module_5__
  return Func("ahk_32")
}
ahk_34() {
  if (A_IsAdmin) {
    return
  }
  Run *RunAs "%A_ScriptFullPath%"
  $exit.Call()
}
ahk_35() {
  $exit := __ahk_module_4__
  return Func("ahk_34")
}
ahk_36(ipt) {
  if ipt is Number
    return "number"
  if (IsFunc(ipt)) {
    return "function"
  }
  if (IsObject(ipt)) {
    if (ipt.Count() == ipt.Length()) {
      if !(ipt.Length() >= 0) {
        return "function"
      }
      return "array"
    }
    return "object"
  }
  return "string"
}
ahk_37() {
  return Func("ahk_36")
}
ahk_38(ipt, omitting := " `t") {
  return Trim(ipt, omitting)
}
ahk_39() {
  return Func("ahk_38")
}
ahk_40(ipt) {
  $result := ipt
  StringLower, $result, ipt
  return $result
}
ahk_41() {
  return Func("ahk_40")
}
ahk_42(list, callback) {
  for $i, $item in list {
    $i := $i - 1
    callback.Call($item, $i)
  }
  return
}
ahk_43() {
  return Func("ahk_42")
}
ahk_44(ipt, delimiter) {
  return StrSplit(ipt, delimiter)
}
ahk_45() {
  return Func("ahk_44")
}
ahk_46(ipt, searchment, replacement, limit := -1) {
  return StrReplace(ipt, searchment, replacement, limit)
}
ahk_47() {
  return Func("ahk_46")
}
ahk_48(args*) {
  return
}
ahk_49() {
  return Func("ahk_48")
}
ahk_50() {
  ExitApp
}
ahk_51() {
  return Func("ahk_50")
}
ahk_52(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}
