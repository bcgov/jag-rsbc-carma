const port = 8080
const { createServer } = require('http')
const {
    sendNotification,
    pong
} = require('./lib')

const server = {
    start: function(done) {
        this.internal = createServer((req, response)=>{
            let observer = { id:new Date().getTime(), headers:req.headers, url:req.url }
            if (req.url == '/carma/v1/sendNotification') {
                sendNotification(req, response, observer)
            }
            else {
                pong(req, response,observer)
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
