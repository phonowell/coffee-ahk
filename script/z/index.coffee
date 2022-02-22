do ->
  a = [
    await fn 1
    await fn 2
    await fn 3
  ]

do ->
  (fn 1).then (v1) ->
    (fn 2).then (v2) ->
      (fn 3).then (v3) ->
        a = [v1, v2, v3]