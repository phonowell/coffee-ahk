a = 'string'

a = "#{a}"

a = "#{1 - 1} === #{1 - 1}?"

a = 'line 1
line 2
line 3'

a = "line #{1}
line #{2}
line #{3}"

a = '''
<strong>
  cup of coffee-ahk
</strong>
'''

a = """
<strong>
  cup of #{name}
</strong>
"""

a = """
call("http#{"s"}")
"""

# === Function context tests ===

# String in function
fn1 = ->
  msg = 'hello'
  return msg

# String interpolation with closure
fn2 = ->
  name = 'world'
  greet = ->
    return "hello #{name}"
  return greet()

# String modification in closure
fn3 = ->
  text = 'initial'
  modifier = ->
    text = 'modified'
  modifier()
  return text

# Complex interpolation with closure
fn4 = ->
  x = 1
  y = 2
  formatter = ->
    return "#{x} + #{y} = #{x + y}"
  return formatter()

# String concat in closure
fn5 = ->
  prefix = 'pre'
  suffix = 'suf'
  builder = ->
    return "#{prefix}_middle_#{suffix}"
  return builder()

# Multiline string with closure vars
fn6 = ->
  x = 'line1'
  y = 'line2'
  builder = ->
    return "#{x}
#{y}"
  return builder()