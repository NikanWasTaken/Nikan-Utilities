const client = require("../../index.js")
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const leftRoles = require("../../models/LeftMembers.js")


// expiring autommod warns

client.on("messageCreate", async (message) => {

    const data = automodModel.find({ guildId: message.guild?.id })
    const finaldata = (await data)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        data.delete()

    })

})


// expiring normal warns

client.on("messageCreate", async (message) => {

    const data = warnModel.find({ guildId: message.guild?.id })
    const finaldata = (await data)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        data.delete()

    })

})


// expiring left member roles 

client.on("messageCreate", async (message) => {

    const data = leftRoles.find({ guildId: message.guild?.id })
    const finaldata = (await data)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        data.delete()

    })

})


