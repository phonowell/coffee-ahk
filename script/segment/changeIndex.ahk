﻿global __rf_salt__ := anonymous(__fn__) {
  if (IsFunc(__fn__)) {
    return __fn__
  }
  throw Exception("invalid function")
}
global __ci_salt__ := anonymous(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}
