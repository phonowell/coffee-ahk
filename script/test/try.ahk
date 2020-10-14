try {
  1
} catch {
  2
}
try {
  1
} catch e {
  2
} finally {
  3
}
fn() {
  try {
    alert(1)
  } catch e {
    throw e
  }
}