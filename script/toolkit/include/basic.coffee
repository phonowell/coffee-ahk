# includes(input: string | array, needle: string): boolean
$.includes = (input, needle) ->
  _type = $.type input
  if _type == 'string' or _type == 'number'
    return (InStr input, needle) > 0
  if _type == 'array'
    for it in input
      if it == needle
        return true
    return false
  throw new Error "$.includes: invalid type '#{_type}'"

# length(input: string | array | object): number
$.length = (input) ->
  _type = $.type input
  switch _type
    when 'array' then return input.Length()
    when 'object' then return input.Count()
    when 'string' then return StrLen input
    else throw new Error "$.length: invalid type '#{_type}'"

# type(input: unknown): 'array' | 'number' | 'object' | 'string'
$.type = (input) ->

  `if input is Number`
  `  return "number"`

  if IsObject input
    if input.Count() == input.Length()
      return 'array'
    return 'object'

  return 'string'