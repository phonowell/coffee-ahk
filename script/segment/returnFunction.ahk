global __rf_salt__ := anonymous(__fn__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function")
}
