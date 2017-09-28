const cleanCurrencyValue = value => value.replace(/[^0-9.,-]+/g, '')

const Sort = {
  Numeric(rawInputOne, rawInputTwo) {
    let valA = parseFloat(rawInputOne.toString().replace(/,/g, ''))
    let valB = parseFloat(rawInputTwo.toString().replace(/,/g, ''))

    // Sort non-numeric values alphabetically at the bottom of the list
    if (isNaN(valA) && isNaN(valB)) {
      valA = rawInputOne
      valB = rawInputTwo
    } else {
      if (isNaN(valA))
        return 1
      if (isNaN(valB))
        return -1
    }

    if (valA < valB)
      return -1

    if (valA > valB)
      return 1

    return 0
  },

  NumericInteger(rawInputOne, rawInputTwo) {
    if (isNaN(rawInputOne) || isNaN(rawInputTwo))
      return rawInputOne > rawInputTwo ? 1 : -1

    return rawInputOne - rawInputTwo
  },

  Currency(valueOne, valueTwo) {
    // Parse out dollar signs, then do a regular numeric sort
    // const cleanedInputOne = valueOne.replace(/[^0-9.-,]+/g, '')
    // const cleanedInputTwo = valueTwo.replace(/[^0-9.-,]+/g, '')

    return this.Sort.Numeric(cleanCurrencyValue(valueOne), cleanCurrencyValue(valueTwo))
  },

  Date(dateOne, dateTwo) {
    // Note: this function tries to do a standard javascript string -> date conversion
    // If you need more control over the date string format, consider using a different
    // date library and writing your own function
    const parsedDateOne = Date.parse(dateOne)
    const parsedDateTwo = Date.parse(dateTwo)

    // Handle non-date values with numeric sort
    // Sort non-numeric values alphabetically at the bottom of the list
    if (isNaN(parsedDateOne) || isNaN(parsedDateTwo))
      return this.Sort.Numeric(dateOne, dateTwo)

    if (parsedDateOne > parsedDateTwo)
      return 1

    if (parsedDateTwo > parsedDateOne)
      return -1

    return 0
  },

  CaseInsensitive(rawInputOne, rawInputTwo) { return rawInputOne.toLowerCase().localeCompare(rawInputTwo.toLowerCase()) }
}

export {Sort}
