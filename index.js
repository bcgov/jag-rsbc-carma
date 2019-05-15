const port = 8080
const url = require('url')
const { createServer, get } = require('http')
const { request, bodyOf } = require('./support/request');
const { extractHost, extractPort } = require('./support/url')
const { basic } = require('./support/basic.auth' )

const server = {
    start: function(done) {
        this.internal = createServer((req, response)=>{
            let params = url.parse(req.url)
            if (params.pathname == '/notifications') {
                var expected = basic(process.env.API_USERNAME, process.env.API_PASSWORD)
                if (req.headers['authorization'] !== expected) {
                    response.statusCode = 401
                    response.end()
                }
                else {
                    bodyOf(req, (body)=>{
                        var notification = {
                            method: 'POST',
                            host: extractHost(process.env.CARMA_URL),
                            port: extractPort(process.env.CARMA_URL),
                            path: process.env.CARMA_URL,
                            body: body,
                            headers: {
                                authorization: basic(process.env.CARMA_USERNAME, process.env.CARMA_PASSWORD),
                                'content-type': 'application/json'
                            }
                        }
                        request(notification, (err, resp, body)=> {
                            response.write(body)
                            response.end()
                        })
                    })
                }
            }
            else {
                response.setHeader('content-type', 'application/json')
                response.write(JSON.stringify({
                    alive:true,
                    version: process.env.OPENSHIFT_BUILD_COMMIT,
                    message:'you reached ' + params.pathname
                }))
                response.end()
            }
        })
        this.internal.listen(port, done);
    }
}

module.exports = {
    port:port
}

server.start(()=>{
    console.log('listening on port', port)
})
