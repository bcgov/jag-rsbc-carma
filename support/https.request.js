const { request } = require('https')
const { bodyOf } = require('./body.of.request')

const send = function(options, callback) {
    const action = request(options, (response)=>{
        bodyOf(response, (body)=>{
            callback(null, response, body)
        })
    })
    action.on('error', (err)=>{
        callback(err)
    })
    if (options.body) {
        action.write(options.body)
        action.end()
    }
    action.end()
}
module.exports = {
    send:send
}
