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
    alert.Call(i + j)
  }
}
for __index_for__, a in [1, 2, 3] {
  for __index_for__, b in [3, 2, 1] {
    alert.Call(a + b)
  }
}
