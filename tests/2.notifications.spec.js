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
        body: 'this-content'
    }
    var carma, sentBody

    beforeEach((done)=>{
        process.env.CARMA_URL = 'http://localhost:5017'
        carma = createServer((request, response)=>{
            sentBody = ''
            request.on('data', (chunk) => {
                sentBody += chunk
            });
            request.on('end', () => {
                response.write('hello world')
                response.end();
            });
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

})
