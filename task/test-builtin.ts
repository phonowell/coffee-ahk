import c2a from '../src/index.js'

const main = async () => {
  // Test the new built-in integration
  console.log('Testing new built-in integration...')

  // Test changeIndex function
  const testCode = `
a = [1, 2, 3]
b = a[i]  # This should trigger changeIndex function
`

  try {
    const result = await c2a(testCode, {
      salt: 'test',
      save: false,
      string: true,
      builtins: true,
      metadata: false,
    })

    console.log('✅ Built-in integration test passed!')
    console.log('Generated code:')
    console.log(result)

    // Check if built-in function is included
    if (result.includes('__ci_test__')) {
      console.log(
        '✅ Built-in function correctly integrated with salt replacement',
      )
    } else console.log('❌ Built-in function salt replacement failed')
  } catch (error) {
    console.error('❌ Built-in integration test failed:', error)
  }
}

export default main
