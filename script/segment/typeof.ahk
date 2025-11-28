global ℓtype_SALT_PLACEHOLDER := Func("salt_1").Bind({})
salt_1(ℓv) {
  if (ℓv == "") {
    return "undefined"
  }
  if ℓv is Number
    return "number"
  if (IsObject(ℓv)) {
    if (IsFunc(ℓv)) {
      return "function"
    }
    return "object"
  }
  return "string"
}