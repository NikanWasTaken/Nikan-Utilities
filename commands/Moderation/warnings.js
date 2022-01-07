const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")

module.exports = {
    name: 'warnings',
    category: 'moderation',
    description: `Check the warnings for a user/yourself`,
    usage: '<user>',
    aliases: ['warns', 'strikes', 'punishes', 'punishments'],
    cooldown: 5000,
    botCommand: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])


        if (args[0] && !user) {


            await client.users.fetch(`${args[0]}`).catch(e => {
                const eo = new MessageEmbed()
                    .setDescription("This user doesn't exist!")
                    .setColor(`RED`)

                message.reply({ embeds: [eo] }).then((msg) => {
                    setTimeout(() => {
                        msg?.delete()
                        message?.delete()
                    }, 5000)

                })

                return;
            })

        }

        const components = (state) => [

            new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Normal Warnings")
                    .setStyle("SECONDARY")
                    .setDisabled(state)
                    .setCustomId("normal"),

                new MessageButton()
                    .setLabel("Automod Warnings")
                    .setStyle("SECONDARY")
                    .setDisabled(state)
                    .setCustomId("automod"),
            )
        ]

        const first = new MessageEmbed()
            .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
            .setColor(`${client.color.serverPurple}`)
            .addField("Normal Warnings", `These are the warnings given to you by moderators!`)
            .addField("Automod Warnings", `These are the warnings given to you by auto moderation!`)
            .setFooter("Please select your warnings type using the buttons below!")

        const msg = await message.reply({ embeds: [first], components: components(false) })

        const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 60000,
        })


        collector.on("collect", async (collected) => {

            if (collected.customId === "normal") {


                if (args[0]) {

                    if (user) {

                        if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                        const userWarnings = await warnModel.find({
                            userId: user.user.id,
                            guildId: message.guild.id,
                        });

                        const nowarns = new MessageEmbed()
                            .setDescription(`${user.user} doesn't have any normal warning!`)
                            .setColor("ORANGE")

                        if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })

                        const embedDescription = userWarnings.map((warn, i) => {
                            const moderator = message.guild.members.cache.get(
                                warn.moderatorId
                            );

                            return [
                                `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                                `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                                `> Moderator: ${moderator ? moderator.user.tag : "Moderator has left!"}`,
                                `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                                `> Reason: ${warn.reason}`,
                            ].join("\n");
                        }).join("\n\n");


                        const embed = new MessageEmbed()
                            .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
                            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`These are all the punishments for ${user.user}.\n\n${embedDescription}`)
                            .setColor("BLURPLE")

                        collected.update({ embeds: [embed] })

                    } else if (!user) {

                        if (collected.user.id !== message.author.id)
                            return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                        let user2 = await client.users.fetch(`${args[0]}`)

                        const userWarnings = await warnModel.find({
                            userId: user2.id,
                            guildId: message.guild.id,
                        });

                        const nowarns = new MessageEmbed().setDescription(`**${user2.tag}** doesn't have any normal warning!`).setColor("ORANGE")
                        if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })

                        const embedDescription = userWarnings.map((warn, i) => {
                            const moderator = message.guild.members.cache.get(
                                warn.moderatorId
                            );

                            return [
                                `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                                `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                                `> Moderator: ${moderator ? moderator.user.tag : "Moderator has left!"}`,
                                `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                                `> Reason: ${warn.reason}`,
                            ].join("\n");
                        }).join("\n\n");


                        const embed = new MessageEmbed()
                            .setAuthor(`${user2.tag}`, user2.displayAvatarURL({ dynamic: true }))
                            .setThumbnail(user2.displayAvatarURL({ dynamic: true }))
                            .setDescription(`These are all the punishments for **${user2.tag}**.\n\n${embedDescription}`)
                            .setColor("BLURPLE")

                        collected.update({ embeds: [embed] })

                    }

                } else {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await warnModel.find({
                        userId: message.author.id,
                        guildId: message.guildId,
                    });

                    const nowarns = new MessageEmbed().setDescription("You don't have any normal punishments, completely clean!").setColor("BLUE")
                    if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })


                    const embedDescription = userWarnings.map((warn, i) => {

                        // const moderator = message.guild.members.cache.get(
                        //     warn.moderatorId
                        // );

                        return [
                            `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                            `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                            `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");

                    const embed = new MessageEmbed()
                        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`These are all the punishments for ${message.author}.\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    collected.update({ embeds: [embed] })

                }


            } else if (collected.customId === "automod") {

                if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

                if (args[0]) {

                    if (user) {

                        if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                        const userWarnings = await automodModel.find({
                            userId: user.user.id,
                            guildId: message.guild.id,
                        });

                        const nowarns = new MessageEmbed().setDescription(`${user.user} doesn't have any auto moderation warning!`).setColor("ORANGE")
                        if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })

                        const embedDescription = userWarnings.map((warn, i) => {

                            return [
                                `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                                `> Date: <t:${~~(warn.date / 1000)}:f>`,
                                `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                                `> Reason: ${warn.reason}`,
                            ].join("\n");
                        }).join("\n\n");


                        const embed = new MessageEmbed()
                            .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
                            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`These are all the automod punishments for ${user.user}.\n\n${embedDescription}`)
                            .setColor("BLURPLE")

                        collected.update({ embeds: [embed] })

                    } else {

                        if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                        let user2 = await client.users.fetch(`${args[0]}`)

                        const userWarnings = await automodModel.find({
                            userId: user2.id,
                            guildId: message.guild.id,
                        });

                        const nowarns = new MessageEmbed().setDescription(`**${user2.tag}** doesn't have any auto moderation warning!`).setColor("ORANGE")
                        if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })

                        const embedDescription = userWarnings.map((warn, i) => {

                            return [
                                `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                                `> Date: <t:${~~(warn.date / 1000)}:f>`,
                                `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                                `> Reason: ${warn.reason}`,
                            ].join("\n");
                        }).join("\n\n");


                        const embed = new MessageEmbed()
                            .setAuthor(`${user2.tag}`, user.user.displayAvatarURL({ dynamic: true }))
                            .setThumbnail(user2.displayAvatarURL({ dynamic: true }))
                            .setDescription(`These are all the automod punishments for **${user2.tag}**.\n\n${embedDescription}`)
                            .setColor("BLURPLE")

                        collected.update({ embeds: [embed] })

                    }

                } else {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await automodModel.find({
                        userId: message.author.id,
                        guildId: message.guildId,
                    });

                    const nowarns = new MessageEmbed().setDescription("You don't have any automod punishments, completely clean!").setColor("BLUE")
                    if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })


                    const embedDescription = userWarnings.map((warn, i) => {

                        return [
                            `\`${i + 1}\`. **${warn.type}** | \`${warn._id}\``,
                            `> Date: <t:${~~(warn.date / 1000)}:f>`,
                            `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");

                    const embed = new MessageEmbed()
                        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`These are all the punishments automod for ${message.author}.\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    collected.update({ embeds: [embed] })


                }
            }


        })

        collector.on("end", async (collected) => { msg.edit({ components: components(true) }) })


    }
}