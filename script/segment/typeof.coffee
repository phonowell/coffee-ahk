ℓtype_SALT_PLACEHOLDER = (λ, ℓv) ->
  if ℓv == ""
    return "undefined"
  Native 'if ℓv is Number'
  Native '  return "number"'
  if IsObject(ℓv)
    if IsFunc(ℓv)
      return "function"
    return "object"
  return "string"
