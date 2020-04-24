const util = require('util')

const sleep = util.promisify(setTimeout)

const createRetrier = (options) => {
    return async function* () {
        const {limit, initialDelay, delayIncrement} = options
        let i = 1
        let delay = initialDelay
        while (i <= limit){
            await sleep(delay)
            yield(i)
            i++
            delay += delayIncrement
        }         
    }
}

exports = module.exports = createRetrier