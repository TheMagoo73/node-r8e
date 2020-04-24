const createRetrier = (options) => {
    return async function* () {
        let i = 1
        const limit = options.limit
        while (i < limit){
            yield(i)
            i++
        } 
    }
}

exports = module.exports = createRetrier