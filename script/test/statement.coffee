# Statement test
# return
fn = -> return 42

# throw
errorFn = -> throw new Error("oops")

# new
obj = new MyClass()

# extends
class Dog extends Animal
  bark: -> "woof"
