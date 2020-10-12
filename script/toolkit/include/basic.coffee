class BasicToolkit

  # length(input: string | array | object): number
  length: (input) ->
    type = $.type input
    if type == 'string'
      return StrLen input
    else if type == 'object'
      return input.Length()
    else
      throw new Error "$.length: invalid type '#{type}'"

  # type(input: unknown): 'number' | 'object' | 'string'
  type: (input) ->
    
    `if input is Number`
    `  return "number"`
    
    if IsObject input
      return 'object'
    
    return 'string'