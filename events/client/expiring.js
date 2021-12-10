const client = require("../../index.js")
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const leftRoles = require("../../models/LeftMembers.js")
const { MessageEmbed } = require("discord.js")


// expiring autommod warns

client.on("messageCreate", async (message) => {

    const data = automodModel.find({ guildId: message.guild?.id })
    const finaldata = (await data)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        const embed = new MessageEmbed()
            .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
            .setColor(`${client.color.expire}`)
            .setTitle(`➜ Punishment Expired`).setURL(`${client.server.invite}`)
            .addField("User", `• ${await client.users.fetch(`${data?.userId}`) || "I couldn't find them!"}`, true)
            .addField("User Tag", `• ${(await client.users.fetch(`${data?.userId}`)).tag || "I couldn't find them!"}`, true)
            .addField("User ID", `• ${(await client.users.fetch(`${data?.userId}`)).id || "I couldn't find them!"}`, true)
            .addField("Reason", `${data?.type} auto moderation warn expired!`)
            .setFooter(`ID: ${data?._id}`)

        client.webhook.autoaction.send({ embeds: [embed] })
        data.delete()

    })

})


// expiring normal warns

client.on("messageCreate", async (message) => {

    const data = warnModel.find({ guildId: message.guild?.id })
    const finaldata = (await data)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        const embed = new MessageEmbed()
            .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
            .setColor(`${client.color.expire}`)
            .setTitle(`➜ Punishment Expired`).setURL(`${client.server.invite}`)
            .addField("User", `• ${await client.users.fetch(`${data?.userId}`) || "I couldn't find them!"}`, true)
            .addField("User Tag", `• ${(await client.users.fetch(`${data?.userId}`)).tag || "I couldn't find them!"}`, true)
            .addField("User ID", `• ${(await client.users.fetch(`${data?.userId}`)).id || "I couldn't find them!"}`, true)
            .addField("Reason", `Normal ${data?.type} expired!`)
            .setFooter(`ID: ${data?._id}`)

        client.webhook.autoaction.send({ embeds: [embed] })
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


