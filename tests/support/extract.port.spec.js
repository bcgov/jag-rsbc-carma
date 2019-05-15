const { expect } = require('chai')
const { extractPort } = require('../../support/url')

describe('extractPort', ()=>{

    it('extracts port from given url', ()=>{
        expect(extractPort('http://this-host:50')).to.equal(50)
    })
    it('extracts port from given url containing several segments', ()=>{
        expect(extractPort('http://this-host:5050/ignore-that')).to.equal(5050)
    })
    it('extracts port and defaults to 80', ()=>{
        expect(extractPort('http://this-host/ignore-that')).to.equal(80)
    })
})
