# ========================================================
# DOCUMENTATION ONLY - Not executed as tests
# Actual error tests are in: tasks/test/errors.ts
# Run with: pnpm test (runs all including error tests)
# ========================================================

# Examples of forbidden syntax that coffee-ahk rejects:

# Optional chaining (AHK v1 has no equivalent)
# x?.y

# Existential operator
# bin?

# Range operator (use explicit arrays instead)
# [1..10]

# Post-if (use "if x then y" instead)
# return 1 if condition

# Spread in object literal (AHK v1 objects don't support)
# obj = { ...other }

# Ternary operator (use "if/else" instead)
# x = a ? b : c
