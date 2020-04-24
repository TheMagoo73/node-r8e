const immediateRetry = require('../src/immediate-retry')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

describe('immediate-retry', () => {

    it('retries the correct number of times', async () => {
        const strategy = immediateRetry({ limit: 3})()

        let count = 0
        let res

        do{
            count++
            res = await strategy.next()
        } while(!res.done)

        count.should.equal(3)
    })
})