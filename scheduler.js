const cron = require(`node-cron`)
const { resolve } = require(`path`)

module.exports = {
    intiCron: (config) => {
        if(cron.validate(config.frequency)){
            cron.schedule(config.frequency, function() {
                console.log("Start Process...")
                const handler = require(resolve(config.handler))
                handler()
            })
        }else{
            console.log(`Invalid Cron`)
        }
    }
}