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

module.exports = {
    request:send
}
