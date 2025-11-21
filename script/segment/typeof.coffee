__typeof_SALT_PLACEHOLDER__ = (__v__) ->
  if __v__ == ""
    return "undefined"
  Native 'if __v__ is Number'
  Native '  return "number"'
  if IsObject(__v__)
    if IsFunc(__v__)
      return "function"
    return "object"
  return "string"
