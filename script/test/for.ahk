for ℓi, value in list {
  ℓi := ℓi - 1
  value
}
for index, value in list {
  index := index - 1
  value
}
for ℓk, value in map {
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
for ℓi, a in [1, 2, 3] {
  ℓi := ℓi - 1
  for ℓi, b in [3, 2, 1] {
    ℓi := ℓi - 1
    alert.Call(a + b)
  }
}