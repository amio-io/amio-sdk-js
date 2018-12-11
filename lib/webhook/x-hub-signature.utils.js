const crypto = require('crypto')

function verifyXHubSignature (xHubSignature, body,  secretToken) {
  const calculatedXHubSignature = calculateXHubSignature(secretToken, body)
  if (xHubSignature !== calculatedXHubSignature) {
    console.error('Integrity check failed')
    return false
  }

  return true
}

function calculateXHubSignature(secret, body) {
  const hmac = crypto.createHmac('sha1', secret)
  hmac.update(body, 'utf-8')
  return `sha1=${hmac.digest('hex')}`
}

console.log(calculateXHubSignature('test-secret', JSON.stringify({"xxx": 123})));

module.exports = {
  verifyXHubSignature,
  calculateXHubSignature
}
