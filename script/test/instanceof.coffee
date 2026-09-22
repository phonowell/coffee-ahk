# Basic instanceof
x = obj instanceof Animal

# In condition
if obj instanceof Dog
  bark()

# Comparison result
isAnimal = pet instanceof Animal

# Declared class renders full-width in comparison
class Widget
ok = w instanceof Widget

# Qualified class name uses the final segment
ns = {C: Widget}
ok2 = w instanceof ns.C
