const { expect } = require('chai')
const { extractHost } = require('../../support/url')

describe('extractHost', ()=>{

    it('extracts host from given url', ()=>{
        expect(extractHost('http://this-host')).to.equal('this-host')
    })
    it('extracts host from given url without trailing slash', ()=>{
        expect(extractHost('http://this-host/')).to.equal('this-host')
    })
    it('extracts host from given url first segment', ()=>{
        expect(extractHost('http://this-host/ignore-that')).to.equal('this-host')
    })
    it('extracts host from given url with port', ()=>{
        expect(extractHost('http://this-host:50')).to.equal('this-host')
    })
    it('extracts host from given url with port and several segments', ()=>{
        expect(extractHost('http://this-host:50/ignore-that')).to.equal('this-host')
    })
})
