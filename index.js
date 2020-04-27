if (process.env.NODE_ENV !== 'production') {
    console.log('loading local config')
    require('dotenv').config();
  }   

//502 Error Fix?
//require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
  
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
    console.log('DEBUG listening on port', port)
    console.log('DEBUG: Dev Build 20200427 1000')
})
