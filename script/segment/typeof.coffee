ℓtype_SALT_PLACEHOLDER = (λ, ℓv) ->
  if ℓv == ""
    return "undefined"
  # AHK v1 special syntax: "if var is Type" requires newline before brace
  Native 'if ℓv is Number'
  Native '{'
  Native '  return "number"'
  Native '}'
  if IsObject(ℓv)
    if IsFunc(ℓv)
      return "function"
    return "object"
  return "string"
