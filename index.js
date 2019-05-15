const { createServer, get } = require('http')
const port = 8080

const server = {
    start: function(done) {
        this.internal = createServer((request, response)=>{
            let params = require('url').parse(request.url)
            response.setHeader('content-type', 'application/json')
            response.write(JSON.stringify({ alive:true, message:'you reached ' + params.pathname }))
            response.end();
        })
        this.internal.listen(port, done);
    }
}
const request = (path)=>{
    return (verify)=>{
        get({ path:path, port:port }, (response)=>{ verify(response) })
    }
}

module.exports = {
    ping:request('/ping')
}

server.start(()=>{
    console.log('listening on port', port)
})
