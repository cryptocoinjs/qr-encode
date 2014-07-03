var stringToBytes = function(s) {
  var bytes = new Array()
  for (var i = 0; i < s.length; i += 1) {
    var c = s.charCodeAt(i)
    bytes.push(c & 0xff)
  }
  return bytes
}

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
var createStringToBytes = function(unicodeData, numChars) {

  // create conversion map.

  var unicodeMap = function() {
    var bin = base64DecodeInputStream(unicodeData)
    var read = function() {
      var b = bin.read()
      if (b == -1) throw new Error()
      return b
    }

    var count = 0
    var unicodeMap = {}
    while (true) {
      var b0 = bin.read()
      if (b0 == -1) break
      var b1 = read()
      var b2 = read()
      var b3 = read()
      var k = String.fromCharCode( (b0 << 8) | b1)
      var v = (b2 << 8) | b3
      unicodeMap[k] = v
      count += 1
    }
    if (count != numChars) {
      throw new Error(count + ' != ' + numChars)
    }

    return unicodeMap
  }()

  var unknownChar = '?'.charCodeAt(0)

  return function(s) {
    var bytes = new Array()
    for (var i = 0; i < s.length; i += 1) {
      var c = s.charCodeAt(i)
      if (c < 128) {
        bytes.push(c)
      } else {
        var b = unicodeMap[s.charAt(i)]
        if (typeof b == 'number') {
          if ( (b & 0xff) == b) {
            // 1byte
            bytes.push(b)
          } else {
            // 2bytes
            bytes.push(b >>> 8)
            bytes.push(b & 0xff)
          }
        } else {
          bytes.push(unknownChar)
        }
      }
    }
    return bytes
  }
}

module.exports = {
  createStringToBytes: createStringToBytes,
  stringToBytes: stringToBytes
}
