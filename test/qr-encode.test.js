var assert = require('assert')

var qr = require('../')

var fixtures = require('./fixtures/qr-encode')

describe('qr-encode', function() {
  fixtures.valid.forEach(function(f) {
    it('should encode ' + f.text + ' size: ' + f.size + ' level: ' + f.level + ' type: ' + f.type, function() {
      var data = qr(f.text, {type: f.type, size: f.size, level: f.level})
      assert.equal(data, f.src)
    })
  })

  fixtures.invalid.forEach(function(f) {
    it('should throw ' + f.text + ' size: ' + f.size + ' level: ' + f.level + ' type: ' + f.type, function() {
      assert.throws(function() {
        var data = qr(f.text, {type: f.type, size: f.size, level: f.level})
      },f.error)
    })
  })
})