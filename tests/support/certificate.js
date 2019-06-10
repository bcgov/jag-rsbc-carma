const fs = require('fs')

const options = {
  key: fs.readFileSync('./tests/support/client-key.pem'),
  cert: fs.readFileSync('./tests/support/client-cert.pem')
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

module.exports = {
    certificate:options
}
