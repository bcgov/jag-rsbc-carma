const { expect } = require('chai')
const { createServer } = require('http')
const { request, bodyOf } = require('../support/request');
const { port } = require('..')

describe('notifications', ()=>{

    var notification = {
        method: 'POST',
        host: 'localhost',
        port: port,
        path: '/notifications',
        body: 'this-content'
    }
    var carma, sentBody, sentAuthorization

    beforeEach((done)=>{
        process.env.CARMA_URL = 'http://localhost:5017'
        process.env.CARMA_USERNAME = 'username'
        process.env.CARMA_PASSWORD = 'password'
        carma = createServer((request, response)=>{
            sentAuthorization = request.headers['authorization'];
            bodyOf(request, (body)=>{
                sentBody = body
                response.write('hello world')
                response.end()
            })
        })
        carma.listen(5017, done);
    })
    afterEach((done)=>{
        carma.close(done)
    })

    it('returns the received response', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(body).to.equal('hello world')
            done()
        })
    })

    it('forwards the body', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(sentBody).to.equal('this-content')
            done()
        })
    })

    it('connects with basic auth', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(sentAuthorization).to.equal('Basic ' + Buffer.from('username:password').toString('base64'))
            done()
        })
    })

})
