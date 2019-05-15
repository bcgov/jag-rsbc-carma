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
        headers: {
            authorization: 'Basic ' + Buffer.from('check:me').toString('base64')
        },
        body: 'this-content'
    }
    var carma, sentBody, sentHeaders, sentPath

    beforeEach((done)=>{
        process.env.CARMA_URL = 'http://localhost:5017/service'
        process.env.CARMA_USERNAME = 'username'
        process.env.CARMA_PASSWORD = 'password'
        process.env.API_USERNAME = 'check'
        process.env.API_PASSWORD = 'me'
        carma = createServer((request, response)=>{
            sentPath = request.url
            sentHeaders = request.headers;
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

    it('sends to correct path', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(sentPath).to.equal('/service')
            done()
        })
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

    it('specifies json-type body', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(sentHeaders['content-type']).to.equal('application/json')
            done()
        })
    })

    it('connects with basic auth', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(sentHeaders['authorization']).to.equal('Basic ' + Buffer.from('username:password').toString('base64'))
            done()
        })
    })

    it('requires basic auth', (done)=>{
        notification.headers['authorization'] = 'Basic ' + Buffer.from('unknown:unknown').toString('base64')
        request(notification, (err, response, body)=> {
            expect(response.statusCode).to.equal(401)
            done()
        })
    })

    it('resists missing basic auth header', (done)=>{
        notification = {
            method: 'POST',
            host: 'localhost',
            port: port,
            path: '/notifications',
            body: 'this-content'
        }
        request(notification, (err, response, body)=> {
            expect(response.statusCode).to.equal(401)
            done()
        })
    })


})
