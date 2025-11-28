// This file is auto-generated during build. Do not edit manually.

export const changeIndex_ahk = `global ℓci_SALT_PLACEHOLDER := Func("salt_1").Bind({})
salt_1(λ, ℓarr, ℓidx) {
  if ℓidx is Number
  {
    if (ℓidx < 0) {
      return ℓarr.Length() + ℓidx + 1
    }
    return ℓidx + 1
  }
  return ℓidx
}`

export const typeof_ahk = `global ℓtype_SALT_PLACEHOLDER := Func("salt_1").Bind({})
salt_1(λ, ℓv) {
  if (ℓv == "") {
    return "undefined"
  }
  if ℓv is Number
  {
    return "number"
  }
  if (IsObject(ℓv)) {
    if (IsFunc(ℓv)) {
      return "function"
    }
    return "object"
  }
  return "string"
}`
