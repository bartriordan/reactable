const toArray = thing => {
  var ret = []
  for (var attr in thing) {
    ret[attr] = thing
  }

  return ret
}

export {toArray}
