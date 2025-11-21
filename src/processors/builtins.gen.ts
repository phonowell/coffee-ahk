// This file is auto-generated during build. Do not edit manually.

export const changeIndex_ahk = `global __ci_SALT_PLACEHOLDER__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}`

export const typeof_ahk = `global __typeof_SALT_PLACEHOLDER__ := Func("salt_1")
salt_1(__v__) {
  if (__v__ == "") {
    return "undefined"
  }
  if __v__ is Number
    return "number"
  if (IsObject(__v__)) {
    if (IsFunc(__v__)) {
      return "function"
    }
    return "object"
  }
  return "string"
}`
