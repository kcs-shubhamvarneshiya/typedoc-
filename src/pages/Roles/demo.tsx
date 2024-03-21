/**
 * Finds min
 */
function min(elements: number[]): number {
    /*
      First of all, set result to maximum available number
      to replace it with actual value on first iteration
    */
    let res = Infinity
  
    // Iterate over provided elements
    for (const el of elements) {
      if (el < res) {
        // Store value as result
        res = el
      }
    }
  
    // Return result
    return res
  }
  export default min