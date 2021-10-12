const cron = require(`node-cron`)
const { resolve } = require(`path`)

module.exports = {
    initCron: (config) => {        
        if(cron.validate(config.frequency)){
            console.log("Initialize Cron...")
            cron.schedule(config.frequency, function() {
                console.log("Start Process...")
                const handler = require(resolve(config.handler))
                handler()
            })
        }else{
            console.log(`Invalid Cron`)
        }
    },
    init: () => {
        const handler = require('./handlers/startprocess')
        handler()
    }
}