const { expect } = require('chai')
const { createServer } = require('http')
const { request } = require('../support/request');
const { port } = require('..')

describe('notifications', ()=>{

    var notification = {
        method: 'POST',
        host: 'localhost',
        port: port,
        path: '/notifications',
        body: 'anything'
    }
    var carma

    beforeEach((done)=>{
        process.env.CARMA_URL = 'http://localhost:5017'
        carma = createServer((request, response)=>{
            response.write('hello world')
            response.end();
        })
        carma.listen(5017, done);
    })

    it('returns the received response', (done)=>{
        request(notification, (err, response, body)=> {
            expect(err).to.equal(null)
            expect(body).to.equal('hello world')
            done()
        })
    })

})