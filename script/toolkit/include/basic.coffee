# include array

class BasicToolkit extends ArrayToolkit

  # includes(input: string | array, needle: string): boolean
  includes: (input, needle) ->
    type = $.type input
    if type == 'string' or type == 'number'
      return (InStr input, needle) > 0
    if type == 'array'
      for it in input
        if it == needle
          return true
      return false
    throw new Error "$.includes: invalid type '#{type}'"

  # length(input: string | array | object): number
  length: (input) ->
    type = $.type input
    if type == 'string'
      return StrLen input
    if type == 'array'
      return input.Length()
    if type == 'object'
      return input.Count()
    throw new Error "$.length: invalid type '#{type}'"

  # type(input: unknown): 'array' | 'number' | 'object' | 'string'
  type: (input) ->
    
    `if input is Number`
    `  return "number"`
    
    if IsObject input
      if input.Count() == input.Length()
        return 'array'
      return 'object'
    
    return 'string'