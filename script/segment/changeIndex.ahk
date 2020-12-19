__ci_salt__ := anonymous(input) {
  if input is Number
    return input + 1
  return input
}
