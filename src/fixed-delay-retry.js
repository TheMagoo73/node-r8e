const util = require('util')

const sleep = util.promisify(setTimeout)

const createRetrier = (options) => {
    return async function* () {
        const {limit, delay} = options
        let i = 1
        while (i <= limit){
            await sleep(delay)
            yield(i)
            i++
        }         
    }
}

exports = module.exports = createRetrier