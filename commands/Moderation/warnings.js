const { MessageEmbed, MessageActionRow, MessageButton, Message, Client } = require("discord.js");
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

        let user;
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.permissions.has("MANAGE_MESSAGES")) member = message.member;
        if (member) user = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user
        if (!member) {
            user = await client.users.fetch(`${args[0]}`).catch(() => { })
        }
        if (!args[0]) {
            member = message.member,
                user = message.author;
        }
        if (!member && !user) return message.reply("This user doesn't exist!")

        const components = (options) => [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("Normal Warnings")
                    .setStyle(options?.style1 ? options?.style1 : "PRIMARY")
                    .setDisabled(options?.disable1 ? options?.disable1 : false)
                    .setCustomId("normal"),

                new MessageButton()
                    .setLabel("Automod Warnings")
                    .setStyle(options?.style2 ? options?.style2 : "PRIMARY")
                    .setDisabled(options?.disable2 ? options?.disable2 : false)
                    .setCustomId("automod"),
            )
        ]


        const first = new MessageEmbed()
            .setAuthor({ name: `${client.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setColor(`${client.color.serverPurple}`)
            .addField("Normal Warnings", `These are the warnings given to you by moderators!`)
            .addField("Automod Warnings", `These are the warnings given to you by auto moderation!`)
            .setFooter({ text: "Please select your warnings type using the buttons below!" })

        const msg = await message.reply({
            embeds: [first],
            components: components()
        })

        const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 30000,
        })


        collector.on("collect", async (collected) => {

            if (collected.customId === "normal") {

                if (user.id !== message.author.id) {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await warnModel.find({
                        userId: user.id,
                        guildId: message.guild.id,
                    });

                    const nowarns = new MessageEmbed()
                        .setDescription(`${user.tag} doesn't have any normal warning!`)
                        .setColor("ORANGE")

                    if (!userWarnings?.length) return collected.update({
                        embeds: [nowarns],
                        components: components({
                            disable1: true,
                            style1: "SUCCESS",
                            style2: "PRIMARY"
                        })
                    })

                    const embedDescription = userWarnings.map((warn, i) => {

                        let moderator;
                        if (message.guild.members.cache.get(warn.moderatorId)) moderator = message.guild.members.cache.get(warn.moderatorId).user.tag
                        if (!message.guild.members.cache.get(warn.moderatorId)) {
                            (async () => {
                                const findMod = await client.users.fetch(`${warn.moderatorId}`).catch(() => { return moderator = "Couldn't find them (deleted account)" })
                                moderator = `${findMod.tag} [NOT IN THE SERVER]`
                            })()
                        }

                        return [
                            `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                            `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                            `> Moderator: ${moderator}`,
                            `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");


                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${user} • ID: ${user?.id}\n\n${embedDescription}`)
                        .setColor("BLURPLE")

                    collected.update({
                        embeds: [embed],
                        components: components({
                            disable1: true,
                            style1: "SUCCESS",
                            style2: "PRIMARY"
                        })
                    })

                } else {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await warnModel.find({
                        userId: user.id,
                        guildId: message.guildId,
                    });

                    const nowarns = new MessageEmbed()
                        .setDescription("You don't have any normal punishments, completely clean!")
                        .setColor("BLUE")
                    if (!userWarnings?.length) return collected.update({
                        embeds: [nowarns],
                        components: components({
                            disable1: true,
                            style1: "SUCCESS",
                            style2: "PRIMARY"
                        })
                    })

                    const embedDescription = userWarnings.map((warn, i) => {

                        return [
                            `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                            `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                            `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${user} • ID: ${user?.id}\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    collected.update({
                        embeds: [embed],
                        components: components({
                            disable1: true,
                            style1: "SUCCESS",
                            style2: "PRIMARY"
                        })
                    })

                }

            } else if (collected.customId === "automod") {

                if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

                if (user.id !== message.author.id) {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await automodModel.find({
                        userId: user.id,
                        guildId: message.guild.id,
                    });

                    const nowarns = new MessageEmbed().setDescription(`${user} doesn't have any auto moderation warning!`).setColor("ORANGE")
                    if (!userWarnings?.length) return collected.update({
                        embeds: [nowarns],
                        components: components({
                            disable2: true,
                            style2: "SUCCESS",
                            style1: "PRIMARY"
                        })
                    })

                    const embedDescription = userWarnings.map((warn, i) => {

                        return [
                            `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                            `> Date: <t:${~~(warn.date / 1000)}:f>`,
                            `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");

                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${user} • ID: ${user?.id}\n\n${embedDescription}`)
                        .setColor("BLURPLE")

                    collected.update({
                        embeds: [embed],
                        components: components({
                            disable2: true,
                            style2: "SUCCESS",
                            style1: "PRIMARY"
                        })
                    })

                } else {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })
                    const userWarnings = await automodModel.find({
                        userId: user.id,
                        guildId: message.guild.id,
                    });

                    const nowarns = new MessageEmbed()
                        .setDescription(`**${user.tag}** doesn't have any auto moderation warning!`)
                        .setColor("ORANGE")
                    if (!userWarnings?.length) return collected.update({
                        embeds: [nowarns],
                        components: components({
                            disable2: true,
                            style2: "SUCCESS",
                            style1: "PRIMARY"
                        })
                    })

                    const embedDescription = userWarnings.map((warn, i) => {

                        return [
                            `\`${i + 1}\`. **${warn.type}** | **ID:** \`${warn._id}\``,
                            `> Date: <t:${~~(warn.date / 1000)}:f>`,
                            `> Expires: ${warn.expires ? `<t:${~~(warn.expires / 1000)}:R>` : "Permanent"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");


                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${user} • ID: ${user?.id}\n\n${embedDescription}`)
                        .setColor("BLURPLE")

                    collected.update({
                        embeds: [embed],
                        components: components({
                            disable2: true,
                            style2: "SUCCESS",
                            style1: "PRIMARY"
                        })
                    })
                }
            }
        })

        collector.on("end", async () => {
            msg.edit({ components: [] })
        })
    }
}