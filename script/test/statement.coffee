# Statement test
# return
fn = -> 42

# throw
errorFn = -> throw new Error("oops")

# new
obj = new MyClass()

# extends
class Animal
  speak: -> "sound"
class Dog extends Animal
  bark: -> "woof"
