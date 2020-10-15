$cd = {}
$ts = {}

# calcCd(name: string): number
calcCd = (name) ->

  result = $cd[name] - ($.now() - $ts[name])
  
  unless result > 0
    return 0

  result = Math.round result / 1e3
  return result