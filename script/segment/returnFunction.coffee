__rf_salt__ = (__fn__) ->
  if IsFunc __fn__ then return __fn__
  throw new Error 'invalid function'