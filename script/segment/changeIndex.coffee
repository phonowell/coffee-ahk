ℓci_SALT_PLACEHOLDER = (λ, ℓarr, ℓidx) ->
  # AHK v1 special syntax: "if var is Type" requires newline before brace
  Native 'if ℓidx is Number'
  Native '{'
  Native '  if (ℓidx < 0) {'
  Native '    return ℓarr.Length() + ℓidx + 1'
  Native '  }'
  Native '  return ℓidx + 1'
  Native '}'
  return ℓidx