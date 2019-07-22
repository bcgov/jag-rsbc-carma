const { basic } = require('../support/basic.auth' )
const { bodyOf } = require('../support/body.of.request')
const { send } = require('../support/https.request')
const flush = require('./flush')
const url = require('url')
const https = require('https')

const sendNotification = (req, response, observer)=> {
    var expected = basic(process.env.API_USERNAME, process.env.API_PASSWORD)
    if (req.headers['authorization'] !== expected) {
        response.statusCode = 401
        flush(response, observer)
    }
    else {
        bodyOf(req, (body)=>{
            observer.body = body
            var notification = {
                method: 'POST',
                host: url.parse(process.env.CARMA_URL).hostname,
                path: url.parse(process.env.CARMA_URL).pathname,
                port: url.parse(process.env.CARMA_URL).port,
                headers: {
                    authorization: basic(process.env.CARMA_USERNAME, process.env.CARMA_PASSWORD),
                    'content-type': 'application/json'
                },
                body: body
            }
            observer.sending = notification
            send(notification, (err, res, content)=> {
                if (err) {
                    observer.error = err
                    flush(response, observer)
                }
                else {
                    observer.answer = content
                    response.write(content)
                    flush(response, observer)
                }
            })
        })
    }
}

module.exports = sendNotification
