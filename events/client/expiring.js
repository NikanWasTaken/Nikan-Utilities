const client = require("../../index.js")
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const leftRoles = require("../../models/LeftMembers.js")
const Roles = require("../../models/MemberRoles.js");
const { MessageEmbed } = require("discord.js")


client.on("messageCreate", async (message) => {

    // expiring autommod warns
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

    // expiriing left member roles
    const dataLeftRoles = leftRoles.find({ guildId: message.guild?.id })
    const finaldata = (await dataLeftRoles)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        data.delete()
    })


    // Expiring member's mutes
    const data = await Roles.find({ guildId: message?.guild?.id });
    const finaldataMutes = (await data)?.filter(c => Date.now() > c.until);

    finaldataMutes.forEach((data) => {

        const findmember = message?.guild?.members?.cache?.get(`${data?.userId}`);

        client.log.autoAction({
            type: "Unmute",
            color: "UNMUTE",
            user: `${data?.userId}`,
            reason: `${data?.reason}`
        });

        if (findmember) {

            data?.roles?.map((w) => findmember?.roles.set(w));
            data.delete()

        } else if (!findmember) {

            leftRoles.findOneAndUpdate({ guildid: message?.guild?.id, user: `${data?.userId}` }, { $set: { roles: [data.roles.map(e => e)] } })
            data.delete()

        }

    })


})

