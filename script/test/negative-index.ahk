global __ci_ahk__ := Func("salt_1")
salt_1(__arr__, __idx__) {
  if __idx__ is Number
    if (__idx__ < 0)
      return __arr__.Length() + __idx__ + 1
    return __idx__ + 1
  return __idx__
}

global arr := [1, 2, 3]
global last := arr[__ci_ahk__.Call(arr, -1)]
global secondLast := arr[__ci_ahk__.Call(arr, -2)]
global third := arr[__ci_ahk__.Call(arr, -3)]
arr[__ci_ahk__.Call(arr, -1)] := 999
arr[__ci_ahk__.Call(arr, -2)] := 888
global obj := {items: [1, 2, 3]}
obj.items[__ci_ahk__.Call(obj.items, -1)] := 100
global nested := [[1, 2], [3, 4]]
global val := nested[1][__ci_ahk__.Call(nested[1], -1)]
global val2 := nested[2][__ci_ahk__.Call(nested[2], -2)]
global matrix := [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
global deep := matrix[1][2][__ci_ahk__.Call(matrix[1][2], -1)]