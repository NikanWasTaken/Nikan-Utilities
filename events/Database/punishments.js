const client = require("../../index.js")
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const leftRoles = require("../../models/LeftMembers.js")


client.on("messageCreate", async (message) => {

    // expiring automod warns
    const dataAutomod = automodModel.find({ guildId: message.guild?.id })
    const finaldataAutomod = (await dataAutomod)?.filter(c => Date.now() > c.expires)

    finaldataAutomod.forEach(async (data) => {

        client.log.autoAction({
            type: "Punishment Expire",
            color: "EXPIRE",
            user: `${data?.userId}`,
            reason: `${data?.type} auto moderation warn expired!`
        });

        data.delete()
    })


    // expiring normal warnings
    const dataNormal = warnModel.find({ guildId: message.guild?.id })
    const finaldataNormal = (await dataNormal)?.filter(c => Date.now() > c.expires)

    finaldataNormal.forEach(async (data) => {

        client.log.autoAction({
            type: "Punishment Expire",
            color: "EXPIRE",
            user: `${data?.userId}`,
            reason: `Normal ${data?.type} expired!`
        });

        data.delete()
    })

    // Expiring left member roles
    const dataLeftRoles = leftRoles.find({ guildId: message.guild?.id })
    const finaldata = (await dataLeftRoles)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        data.delete()
    })


})

