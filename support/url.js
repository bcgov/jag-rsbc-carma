var extractHostAndPort = function(url) {
    return url.split('/')[2]
}

var extractHost = function(url) {
    return extractHostAndPort(url).split(':')[0]
}
var extractPort = function(url) {
    var candidate = extractHostAndPort(url).split(':')[1]

    return isNaN(candidate)? 80 : parseInt(candidate)
}

module.exports = {
    extractHost:extractHost,
    extractPort:extractPort
}
