# reverse(input: unknown[]): unknown[]
$.reverse = (input) ->

  _type = $.type input
  unless _type == 'array'
    throw new Error "$.reverse: invalid type '#{_type}'"

  _len = $.length input
  _output = []
  for key, i in input
    _output[_len - i + 1] = key

  return _output