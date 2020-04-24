const util = require('util')

const sleep = util.promisify(setTimeout)

/**
 * Execute a retryable function using the supplied retry strategy
 * @param {object} options
 * @param {function} options.action the retryable action
 * @param {function} options.strategy defines how retrys are performed
 * @param {any} args arguments to pass to the action
 * @returns {any} 
 */
const retryableExecute = async (options, ...args) => {

    if(!options.strategy || typeof(options.strategy) !== 'function') {
        throw new Error('A retry strategy must be supplied')
    }

    if(!options.action || typeof(options.action) !== 'function') {
        throw new Error('An action must be supplied')
    }

    if(!options.abortedValue) {
        options.abortedValue = undefined
    }

    let strategy = options.strategy()

    try {
        let res
        let rere
        
        res = await options.action(...args)

        while(!res.succeeded) {
            rere = await strategy.next()
            if(rere.done) break

            res = await(options.action(...args))
        }

        if(res.succeeded) {
            return res.result
        }
        else {
            return res.abortedValue
        }
    }
    catch(e) {
        return options.abortedValue
    }

}

exports = module.exports = {
    retryableExecute
}