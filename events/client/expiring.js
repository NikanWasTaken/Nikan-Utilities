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

        const embed = new MessageEmbed()
            .setAuthor({ name: "Automatic Actions", iconURL: client.user.displayAvatarURL() })
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


    // expiring normal warnings
    const dataNormal = warnModel.find({ guildId: message.guild?.id })
    const finaldataNormal = (await dataNormal)?.filter(c => Date.now() > c.expires)

    finaldataNormal.forEach(async (data) => {

        const embed = new MessageEmbed()
            .setAuthor({ name: "Automatic Actions", iconURL: client.user.displayAvatarURL() })
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

    // expiriing left member roles
    const dataLeftRoles = leftRoles.find({ guildId: message.guild?.id })
    const finaldata = (await dataLeftRoles)?.filter(c => Date.now() > c.expires)

    finaldata.forEach(async (data) => {

        data.delete()
    })


    // Expiring member's mutes
    const data = await Roles.find({ guildId: message?.guild?.id });
    const finaldata = (await data)?.filter(c => Date.now() > c.until);

    finaldata.forEach((data) => {

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

