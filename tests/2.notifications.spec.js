const { expect } = require('chai')
const { createServer } = require('https')
const { request } = require('./support/request');
const { bodyOf } = require('../support/body.of.request')
const { certificate } = require('./support/certificate')
const { port } = require('..')

describe('notifications API', ()=>{

    var notification
    var carma, sentBody, sentHeaders, sentPath

    beforeEach((done)=>{
        process.env.CARMA_URL = 'http://localhost:5017/service'
        process.env.CARMA_USERNAME = 'username'
        process.env.CARMA_PASSWORD = 'password'
        process.env.API_USERNAME = 'check'
        process.env.API_PASSWORD = 'me'
        carma = createServer(certificate, (request, response)=>{
            sentPath = request.url
            sentHeaders = request.headers;
            bodyOf(request, (body)=>{
                sentBody = body
                response.write('hello world')
                response.end()
            })
        })
        carma.listen(5017, ()=>{
            notification = {
                method: 'POST',
                host: 'localhost',
                port: port,
                path: '/carma/v1/sendNotification',
                headers: {
                    authorization: 'Basic ' + Buffer.from('check:me').toString('base64')
                },
                body: 'this-content'
            }
            done()
        })
    })
    afterEach((done)=>{
        carma.close(done)
    })

    it('requires basic auth', (done)=>{
        notification.headers['authorization'] = 'Basic ' + Buffer.from('someone:not-me').toString('base64')
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
            path: '/carma/v1/sendNotification',
            body: 'this-content'
        }
        request(notification, (err, response, body)=> {
            expect(response.statusCode).to.equal(401)
            done()
        })
    })

    it('returns the received response as json', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(response.headers['content-type']).to.equal('application/json')
            expect(body).to.equal(JSON.stringify({ message:'hello world' }))
            done()
        })
    })

    it('sends to correct path', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(sentPath).to.equal('/service')
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
})
