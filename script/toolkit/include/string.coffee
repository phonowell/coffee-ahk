# include speaker

class StringToolkit extends SpeakerToolkit

  # replace(
  #   input: string,
  #   searchment: string,
  #   replacement: string,
  #   limit: number = -1
  # )
  replace: (input, searchment, replacement, limit = -1) ->
    return StrReplace input, searchment, replacement, limit

  # toLowerCase(input: string): string
  toLowerCase: (input) ->
    `StringLower, __Result__, input`
    return __Result__

  # toString(input: unknown): string
  toString: (input) ->
    type = $.type input
    if type == 'object'
      result = ''
      for key, value of input
        result = "#{result}, #{key}: #{value}"
      return "{#{$.trim result, ' ,'}}"
    return input

  # toUpperCase(input: string): string
  toUpperCase: (input) ->
    `StringUpper, __Result__, input`
    return __Result__

  # trim(input: string, omitting: string): string
  trim: (input, omitting = ' \t') ->
    return Trim input, omitting

  # trimEnd(input: string, omitting: string): string
  trimEnd: (input, omitting = ' \t') ->
    return RTrim input, omitting

  # trimStart(input: string, omitting: string): string
  trimStart: (input, omitting = ' \t') ->
    return LTrim input, omitting