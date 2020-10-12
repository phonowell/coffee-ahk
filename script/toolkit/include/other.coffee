# include getter

class OtherToolkit extends GetterToolkit

  # now(): number
  now: -> return A_TickCount
  
  # random(min: number = 0, max: number = 1): number
  random: (min = 0, max = 1) ->
    `Random, __Result__, min, max`
    return __Result__