# replace(
#   input: string,
#   searchment: string,
#   replacement: string,
#   limit: number = -1
# )
$.replace = (input, searchment, replacement, limit = -1) ->
  return StrReplace input, searchment, replacement, limit

# split(input: string, delimiter: string): string
$.split = (input, delimiter) -> return StrSplit input, delimiter

# toLowerCase(input: string): string
$.toLowerCase = (input) ->
  `StringLower, __Result__, input`
  return __Result__

# toString(input: unknown): string
$.toString = (input) ->
  _type = $.type input
  if _type == 'array'
    _result = ''
    for key in input
      _result = "#{_result}, #{$.toString key}"
    return "[#{$.trim _result, ' ,'}]"
  else if _type == 'object'
    _result = ''
    for key, value of input
      _result = "#{_result}, #{key}: #{$.toString value}"
    return "{#{$.trim _result, ' ,'}}"
  return input

# toUpperCase(input: string): string
$.toUpperCase = (input) ->
  `StringUpper, __Result__, input`
  return __Result__

# trim(input: string, omitting: string): string
$.trim = (input, omitting = ' \t') ->
  return Trim input, omitting

# trimEnd(input: string, omitting: string): string
$.trimEnd = (input, omitting = ' \t') ->
  return RTrim input, omitting

# trimStart(input: string, omitting: string): string
$.trimStart = (input, omitting = ' \t') ->
  return LTrim input, omitting