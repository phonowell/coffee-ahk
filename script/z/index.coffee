# @ts-check

do ->

  a = 1

  do (a = a) ->

    a = 2
    return a