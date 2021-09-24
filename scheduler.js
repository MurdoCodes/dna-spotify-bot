const cron = require(`node-cron`)
const { resolve } = require(`path`)


module.exports = {
    initCrons: (config) => {
        if(cron.validate(config.frequency)){
            cron.schedule(config.frequency, () => {
                console.log("Start Task")
                const handler = require(resolve(config.handler))
                handler()
            })
        }else{
            console.log(`invalid`)
        }
    },
    tester: (config) => {
        const handler = require(resolve(config.handler))
        handler()
    }
}