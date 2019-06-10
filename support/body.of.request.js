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
    bodyOf:bodyOf
}
