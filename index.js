const port = 8080
const url = require('url')
const { createServer, get } = require('http')
const { request, bodyOf } = require('./support/request');
const { extractHost, extractPort } = require('./support/url')

const server = {
    start: function(done) {
        this.internal = createServer((req, response)=>{
            let params = url.parse(req.url)
            if (params.pathname == '/notifications') {
                bodyOf(req, (body)=>{
                    var notification = {
                        method: 'POST',
                        host: extractHost(process.env.CARMA_URL),
                        port: extractPort(process.env.CARMA_URL),
                        path: process.env.CARMA_URL,
                        body: body
                    }
                    request(notification, (err, resp, body)=> {
                        response.write(body)
                        response.end()
                    })
                })
            }
            else {
                response.setHeader('content-type', 'application/json')
                response.write(JSON.stringify({ alive:true, message:'you reached ' + params.pathname }))
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
