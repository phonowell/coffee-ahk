# reverse(input: unknown[]): unknown[]
$.reverse = (input) ->
  
  type = $.type input
  unless type == 'array'
    throw new Error "$.reverse: invalid type '#{type}'"

  len = $.length input
  output = []
  for key, i in input
    output[len - i + 1] = key

  return output