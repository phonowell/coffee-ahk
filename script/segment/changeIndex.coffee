__ci_SALT_PLACEHOLDER__ = (__arr__, __idx__) ->
  Native 'if __idx__ is Number'
  Native '  if (__idx__ < 0)'
  Native '    return __arr__.Length() + __idx__ + 1'
  Native '  return __idx__ + 1'
  return __idx__