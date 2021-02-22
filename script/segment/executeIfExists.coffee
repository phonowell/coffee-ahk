__eie_salt__ = (callback) ->
  unless IsFunc callback
    return ''
  return callback()