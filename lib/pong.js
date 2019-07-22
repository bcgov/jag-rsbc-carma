const flush = require('./flush')
const url = require('url')

const pong = (req, response, observer)=> {
    let params = url.parse(req.url)
    let answer = {
        alive:true,
        version: process.env.OPENSHIFT_BUILD_COMMIT,
        message:'you reached ' + params.pathname
    }
    observer.answer = answer
    response.setHeader('content-type', 'application/json')
    response.write(JSON.stringify(answer))

    flush(response, observer)
}

module.exports = pong
