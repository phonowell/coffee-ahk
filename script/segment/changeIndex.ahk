global __ci_salt__ := anonymous(__ipt__) {
  if __ipt__ is Number
    return __ipt__ + 1
  return __ipt__
}
