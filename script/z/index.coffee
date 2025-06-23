# Comprehensive Promise/Async Test

# 1. Basic async function
fetchData = ->
  data = await httpGet("api/data")
  return JSON.parse(data)

# 2. Async function with parameters and error handling
processData = (url, options) ->
  try
    response = await fetch(url, options)
    result = await response.json()
    return result
  catch err
    console.error("Failed to process:", err)
    throw err

# 3. Promise constructor with timeout
delay = (ms) ->
  new Promise (resolve) ->
    setTimeout(resolve, ms)

# 4. Promise.all for parallel operations
loadAllData = ->
  Promise.all([
    fetchData()
    delay(1000)
    processData("/api/users", { method: "GET" })
  ])

# 5. Promise chaining with error handling
pipeline = ->
  fetchData()
    .then (data) ->
      console.log("Got data:", data)
      return processData("/api/process", {
        method: "POST"
        body: JSON.stringify(data)
      })
    .then (result) ->
      console.log("Processed:", result)
      return result
    .catch (err) ->
      console.error("Pipeline failed:", err)
      return null
    .finally ->
      console.log("Pipeline complete")

# 6. Complex async workflow
complexWorkflow = ->
  try
    # Sequential operations
    userData = await fetchData()
    processedData = await processData("/transform", userData)

    # Parallel operations
    [result1, result2, result3] = await Promise.all([
      processData("/save", processedData)
      processData("/backup", processedData)
      delay(500)
    ])

    # Final step
    finalResult = await processData("/finalize", { result1, result2 })
    return finalResult
  catch err
    console.error("Workflow failed:", err)
    throw err