const { expect } = require('chai')
const { port } = require('..')
const { request } = require('./support/request');

describe('server', ()=>{

    var ping = {
        method: 'GET',
        host: 'localhost',
        port: port,
        path: '/wonderland'
    }

    beforeEach(()=>{
        process.env.OPENSHIFT_BUILD_COMMIT = 'this-commit'
    })

    it('is alive', (done)=>{
        request(ping, (err, response, body)=> {
            expect(response.statusCode).to.equal(200);
            done();
        })
    })

    it('returns json', (done)=>{
        request(ping, (err, response, body)=> {
            expect(response.headers['content-type']).to.equal('application/json');
            done();
        })
    })

    it('returns expected data', (done)=>{
        request(ping, (err, response, body)=> {
            expect(body).to.deep.equal(JSON.stringify({
                alive:true,
                version: 'this-commit',
                message: 'you reached /wonderland'
            }))
            done();
        })
    })
})
