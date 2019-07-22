const { expect } = require('chai')
const { createServer } = require('https')
const { request } = require('./support/request');
const { bodyOf } = require('../support/body.of.request')
const { certificate } = require('./support/certificate')
const { port } = require('..')
const moment = require('moment')

describe('notifications API', ()=>{

    var notification
    var carma, carmaPath, carmaHeaders, carmaBody
    var adfs, adfsPath, adfsHeaders, adfsBody

    beforeEach((done)=>{
        process.env.API_USERNAME = 'check'
        process.env.API_PASSWORD = 'me'

        process.env.ADFS_URL = 'http://localhost:5018/adfs/oauth2/token'
        process.env.CARMA_CLIENT_ID = 'this-client-id'
        process.env.CARMA_CLIENT_SECRET = 'this-client-secret'
        process.env.CARMA_RESOURCE = 'this-carma-resource'
        process.env.CARMA_USERNAME = 'this-carma-username'
        process.env.CARMA_PASSWORD = 'this-carma-password'

        process.env.CARMA_URL = 'http://localhost:5017/api/data/v9.0/rsbc_reliablemessages'


        adfs = createServer(certificate, (request, response)=>{
            adfsPath = request.url
            adfsHeaders = request.headers
            bodyOf(request, (body)=> {
                adfsBody = body
                response.write(JSON.stringify({ access_token:'THIS-TOKEN' }))
                response.end()
            })
        })
        adfs.listen(5018, ()=>{

            carma = createServer(certificate, (request, response)=>{
                carmaPath = request.url
                carmaHeaders = request.headers;
                bodyOf(request, (body)=>{
                    carmaBody = body
                    response.write('all good')
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
                    body: JSON.stringify({
                        correlationId: '12345',
                        noticeNumber: '22884433',
                        noticeTypeCd: 'IMP',
                        eventDtm: '2019-07-16T00:00:00.000-07:00',
                        eventTypeCd: 'ADRV'
                    })
                }
                done()
            })
        })
    })
    afterEach((done)=>{
        carma.close(()=>{
            adfs.close(done)
        })
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
            expect(response.statusCode).to.equal(200)
            expect(response.headers['content-type']).to.equal('application/json')
            expect(JSON.parse(body).message).to.equal('all good')
            done()
        })
    })

    it('requests a token to ADFS', (done)=>{
        request(notification, (err, response, answer)=> {
            expect(err).to.equal(null)
            expect(response.statusCode).to.equal(200)
            expect(adfsPath).to.equal('/adfs/oauth2/token')
            var oauthClientRequestId = JSON.parse(answer).oauthClientRequestId
            expect(adfsBody).to.equal('client_id=this-client-id&client_secret=this-client-secret&resource=this-carma-resource&username=this-carma-username&password=this-carma-password&scope=openid&response_mode=form_post&grant_type=password')
            expect(adfsHeaders).to.deep.equal({
                'connection': 'close',
                'host': 'localhost:5018',
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': `${Buffer.byteLength(adfsBody)}`,
                'client-request-id': oauthClientRequestId,
                'return-client-request-id': 'true',
                'accept': 'application/json'
            })
            done()
        })
    })

    it('sends message creation request to CARMA', (done)=> {
        request(notification, (err, response, answer)=> {
            expect(err).to.equal(null)
            expect(response.statusCode).to.equal(200)
            expect(carmaPath).to.equal('/api/data/v9.0/rsbc_reliablemessages')
            expect(carmaBody).to.equal(JSON.stringify({
                rsbc_name: `${moment().format('YYYY_MM_DD_hh_mm_ss')}_22884433`,
                rsbc_payload: JSON.stringify({
                    correlationId: '12345',
                    noticeNumber: '22884433',
                    noticeTypeCd: 'IMP',
                    eventDtm: '2019-07-16T00:00:00.000-07:00',
                    eventTypeCd: 'ADRV'
                })
            }))
            expect(carmaHeaders).to.deep.equal({
                'connection': 'close',
                'host': 'localhost:5017',

                'odata-maxversion': '4.0',
                'odata-version': '4.0',
                'accept': 'application/json',
                'prefer': 'odata.maxpagesize=10',

                'content-type': 'application/json',
                'content-length': `${Buffer.byteLength(carmaBody)}`,
                'authorization': 'Bearer THIS-TOKEN'
            })
            done()
        })
    })
})
