global __eie_salt__ := anonymous(__callback__) {
  if !(IsFunc(__callback__)) {
    return ""
  }
  return __callback__.Call()
}
