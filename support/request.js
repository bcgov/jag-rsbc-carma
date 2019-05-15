const { request } = require('http')

const send = function(options, callback) {
    const action = request(options, (response)=>{
        var body = ''
        response.on('data', (chunk) => {
            body += chunk
        });
        response.on('end', () => {
            callback(null, response, body)
        });
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

const bodyOf = function(message, callback) {
    var body = ''
    message.on('data', (chunk) => {
        body += chunk
    });
    message.on('end', () => {
        callback(body)
    });
}

module.exports = {
    request:send,
    bodyOf:bodyOf
}
