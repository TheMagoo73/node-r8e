const nullRetry = require('../src/null-retry')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

describe('null-retry', () => {

    it('does not retry', () => {
        const strategy = nullRetry()

        return strategy.next().should.eventually.contain({done: true})
    })

})