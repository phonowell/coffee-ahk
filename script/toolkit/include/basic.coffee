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
    switch type
      when 'array' then return input.Length()
      when 'object' then return input.Count()
      when 'string' then return StrLen input
      else throw new Error "$.length: invalid type '#{type}'"

  # type(input: unknown): 'array' | 'number' | 'object' | 'string'
  type: (input) ->
    
    `if input is Number`
    `  return "number"`
    
    if IsObject input
      if input.Count() == input.Length()
        return 'array'
      return 'object'
    
    return 'string'