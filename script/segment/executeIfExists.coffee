__eie_salt__ = (__callback__) ->
  unless IsFunc __callback__
    return ''
  return __callback__()