switch a
  when 1 then a++
  when 2, 3 then a--
  else a += 1

# === Function context tests ===

# switch modifying outer variable
fn1 = ->
  result = 'none'
  x = 2
  switch x
    when 1
      result = 'one'
    when 2
      result = 'two'
    else
      result = 'other'
  return result

# switch with closure in case
fn2 = ->
  value = 0
  x = 1
  switch x
    when 1
      setter = ->
        value = 100
      setter()
    when 2
      value = 200
  return value

# switch with multiple conditions and closure
fn3 = ->
  result = ''
  x = 3
  switch x
    when 1, 2
      result = 'low'
    when 3, 4
      modifier = ->
        result = 'mid'
      modifier()
    else
      result = 'high'
  return result

# switch else with closure
fn4 = ->
  status = 'unknown'
  code = 99
  switch code
    when 0
      status = 'ok'
    when 1
      status = 'error'
    else
      handler = ->
        status = 'unhandled'
      handler()
  return status

# Nested switch with closure
fn5 = ->
  result = 0
  a = 1
  b = 2
  switch a
    when 1
      switch b
        when 2
          setter = ->
            result = 12
          setter()
        else
          result = 10
    else
      result = 0
  return result

# switch on expression with closure
fn6 = ->
  x = 5
  y = 3
  result = 0
  calculator = ->
    return x + y
  switch calculator()
    when 8
      result = 'eight'
    else
      result = 'other'
  return result