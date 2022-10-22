global __rf_salt__ := anonymous(__fn__, __token__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__token__) . "")
}
