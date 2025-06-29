# @ts-check

import $reverse from './includes/reverse'

# Test 5: Array with duplicate elements
duplicateList = [1, 2, 2, 1]
duplicateReversed = $reverse duplicateList

unless duplicateReversed[0] == 1 and
    duplicateReversed[1] == 2 and
    duplicateReversed[2] == 2 and
    duplicateReversed[3] == 1
  throw new Error "REV007: Expected [1,2,2,1], got [#{duplicateReversed}]"