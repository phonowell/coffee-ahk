# This file tests FORBIDDEN syntax that should throw errors
# Run with: pnpm task test-errors

# Optional chaining (not supported)
# x?.y

# Existential operator
# bin?

# Range operator
# [1..10]

# Post-if (should fail)
# return 1 if condition

# Invalid spread in object
# obj = { ...other }
