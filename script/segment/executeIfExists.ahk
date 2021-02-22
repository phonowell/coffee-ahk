global __eie_salt__ := anonymous(callback) {
  if !(IsFunc(callback)) {
    return ""
  }
  return callback.Call()
}
