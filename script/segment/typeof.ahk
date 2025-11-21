global __typeof_SALT_PLACEHOLDER__ := Func("salt_1")
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
}