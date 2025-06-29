global __ci_salt__ := Func("salt_1")
salt_1(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}