# ========================================================
# DOCUMENTATION ONLY - Not executed as tests
# Actual error tests are in: tasks/test/errors.ts
# Run with: pnpm test (runs all including error tests)
# ========================================================

# Forbidden compound assignment operators:

# Logical OR assignment (AHK v1 has no ||= equivalent)
# x ||= 1

# Existential assignment (AHK v1 has no ?= equivalent)
# x ?= 2

# Logical AND assignment
# x &&= 2

# Floor division (// is comment in AHK)
# x //= 3

# Modulo (%% not supported)
# x %%= 3
