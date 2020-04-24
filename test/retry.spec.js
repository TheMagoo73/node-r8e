const retry = require('../src/retry')

const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.should()

describe('retry', async () => {

    describe('option validation', async() => {

        it('requires an action', () => {
            return retry.retryableExecute({strategy: function*() {}}).should.be.rejected
        })

        it('requires a strategy', () => {
            return retry.retryableExecute({action: () => {}}).should.be.rejected
        })
        
    })

    describe('retries using actions and strategies', () => {

        let sandbox = sinon.createSandbox()

        let nextOnce, noRetryStrategy, failAction, nextTwice, retryStrategy, succeedAction, abortAction
        beforeEach(() => {
            nextOnce = sinon.stub().resolves({value: 1, done: true}) 
            noRetryStrategy = () => {return {
                next: nextOnce
            }}

            failAction = sinon.stub().returns({succeeded: false, result: {foo: 'bar'}})
            succeedAction = sinon.stub().returns({succeeded: true, result: "foo"})
            abortAction = sinon.stub().throws()

            nextTwice = sinon.stub()
            nextTwice.onCall(0).resolves({value: 1, done: false})
            nextTwice.onCall(1).resolves({value: 2, done: true})
            retryStrategy = () => {return {
                next: nextTwice
            }}
    
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('calls the action and strategy', async () => {
            await retry.retryableExecute({strategy: noRetryStrategy, action: failAction})
            failAction.should.be.calledOnce
            nextOnce.should.be.calledOnce
        }) 

        it('Calls the strategy and retires the action correctly', async () => {
            await retry.retryableExecute({strategy: retryStrategy, action: failAction})
            failAction.should.be.calledTwice
            nextTwice.should.be.calledTwice
        })

        it('Returns as soon as a try succeeds', async () => {
            result = await retry.retryableExecute({strategy: retryStrategy, action: succeedAction})
            succeedAction.should.be.calledOnce
            nextTwice.should.not.be.called
            result.should.deep.equal('foo')
        })

        it('Aborts early if the action throws', async () => {
            result = await retry.retryableExecute({strategy: retryStrategy, action: abortAction, abortedValue: 'bar'})
            abortAction.should.be.calledOnce
            nextTwice.should.not.be.called
            result.should.deep.equal('bar')
        })
    })
})