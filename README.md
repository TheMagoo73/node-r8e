# node-r8e
Resilience pipelines for Node 

## Installation

## Retryable

Retyable enables automatic retries for function using a variety of customizable strategies.

### Example

```javascript
const retryable = require('./src/retry')
const slidingRetry = require('./src/sliding-delay-retry')

const f = async () => {
    const result = await retryable.retryableExecute({
        action: (salutation, name) => { console.log(`${salutation} ${name}!`); return { succeeded: false } },
        strategy: slidingRetry({limit: 5, initialDelay: 1000, delayIncrement: 1000})
    },
    'Hello',
    'Foo')
}
```

In this example we log to the console and always fail the operation. We use a retry strategy with a sliding delay, starting at 1s and increasing by 1s each retry.

### Provided Retry strategies

| Strategy | Description |
| --- | --- |
| null | Don't actually retry |
| immediate | Retry immediately on failure, up to a limited number of attempts | 
| fixed-delay | As the immediate delay, but with a fixed wait between retries |
| sliding-delay | As with fixed delay, but the wait between retries increments by a fixed value between each retry |