global __rf_ahk__ := Func("ahk_1")
for __index_for__, value in list {
  value
}
for index, value in list {
  index := index - 1
  value
}
for __key_for__, value in map {
  value
}
for key, value in map {
  value
}
for i, a in [1, 2, 3] {
  i := i - 1
  for j, b in [3, 2, 1] {
    j := j - 1
    __rf_ahk__.Call(alert, "#rf/ahk/1").Call(i + j)
  }
}
for __index_for__, a in [1, 2, 3] {
  for __index_for__, b in [3, 2, 1] {
    __rf_ahk__.Call(alert, "#rf/ahk/2").Call(a + b)
  }
}
ahk_1(__fn__, __token__) {
  if (__fn__) {
    return __fn__
  }
  throw Exception("invalid function: " . (__token__) . "")
}