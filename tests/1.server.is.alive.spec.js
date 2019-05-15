const { expect } = require('chai')
const { ping } = require('..')

describe('server', ()=>{

    it('is alive', (done)=>{
        ping((response)=>{
            expect(response.statusCode).to.equal(200);
            done();
        })
    })

    it('returns json', (done)=>{
        ping((response)=>{
            expect(response.headers['content-type']).to.equal('application/json');
            done();
        })
    })

    it('returns expected data', (done)=>{
        ping((response)=>{
            var body = '';
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                expect(body).to.deep.equal(JSON.stringify({
                    alive:true,
                    message: 'you reached /ping'
                }))
                done();
            });
        })
    })
})
