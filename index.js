const { createServer, get } = require('http')
const { request } = require('./support/request');
const port = 5050

const server = {
    start: function(done) {
        this.internal = createServer((req, response)=>{
            let params = require('url').parse(req.url)
            if (params.pathname == '/notifications') {
                var notification = {
                    method: 'POST',
                    host: 'localhost',
                    port: 5017,
                    path: '/other',
                    body: 'anything'
                }
                request(notification, (err, resp, body)=> {
                    response.write(body)
                    response.end()
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
