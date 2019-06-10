var basic = function(username, password) {
    return 'Basic ' + Buffer.from(username+':'+password).toString('base64')
}

module.exports = {
    basic:basic
}
