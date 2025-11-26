ℓci_SALT_PLACEHOLDER = (ℓarr, ℓidx) ->
  Native 'if ℓidx is Number'
  Native '  if (ℓidx < 0)'
  Native '    return ℓarr.Length() + ℓidx + 1'
  Native '  return ℓidx + 1'
  return ℓidx