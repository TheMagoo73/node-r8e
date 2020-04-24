const retryable = require('./src/retry')
const nullRetry = require('./src/null-retry')
const immediateRetry = require('./src/immediate-retry')
const delayRetry = require('./src/fixed-delay-retry')
const slidingRetry = require('./src/sliding-delay-retry')

f = async () => {
    const result = await retryable.retryableExecute({
        action: (salutation, name) => { console.log(`${salutation} ${name}!`); return { succeeded: false } },
        strategy: slidingRetry({limit: 5, initialDelay: 1000, delayIncrement: 1000})
    },
    'Hello',
    'Foo')
}

f()