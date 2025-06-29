export default (list) ->

  $len = list.Length()

  $listNew = []
  for $item, $i in list
    $listNew[$len - 1 - $i] = $item

  return $listNew