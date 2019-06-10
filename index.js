const port = 8080
const url = require('url')
const https = require('https')
const { createServer, get } = require('http')
const { bodyOf } = require('./support/body.of.request')
const { basic } = require('./support/basic.auth' )

const server = {
    flush: function(response, observer) {
        response.end()
        console.log(observer)
    },
    start: function(done) {
        this.internal = createServer((req, response)=>{
            let observer = { id:new Date().getTime(), headers:req.headers, url:req.url }
            let params = url.parse(req.url)
            if (params.pathname == '/notifications') {
                var expected = basic(process.env.API_USERNAME, process.env.API_PASSWORD)
                if (req.headers['authorization'] !== expected) {
                    response.statusCode = 401
                    this.flush(response, observer)
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
                            }
                        }
                        observer.sending = notification
                        const request = https.request(notification, (res)=>{
                            bodyOf(res, (content)=>{
                                observer.answer = content
                                response.write(content)
                                this.flush(response, observer)
                            })
                        })
                        request.on('error', (e)=>{
                            observer.error = e
                            this.flush(response, observer)
                        })
                        request.write(body)
                        request.end()
                    })
                }
            }
            else {
                let answer = {
                    alive:true,
                    version: process.env.OPENSHIFT_BUILD_COMMIT,
                    message:'you reached ' + params.pathname
                }
                observer.answer = answer
                response.setHeader('content-type', 'application/json')
                response.write(JSON.stringify(answer))
                this.flush(response, observer)
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
