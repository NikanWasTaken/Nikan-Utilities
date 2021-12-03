const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const moment = require("moment")

module.exports = {
    name: 'warnings',
    category: 'moderation',
    description: `Check the warnings for a user/yourself`,
    usage: '<user>',
    aliases: ['warns', 'strikes', 'punishes', 'punishments'],
    cooldown: 5000,
    botCommandOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])


        if (user) {

            let no = new MessageEmbed().setDescription('You can only check your own warnings').setColor("RED")
            if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [no] })

        }

        const components = (state) => [

            new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Normal Strikes")
                    .setStyle("SECONDARY")
                    .setDisabled(state)
                    .setCustomId("normal"),

                new MessageButton()
                    .setLabel("Automod Stikes")
                    .setStyle("SECONDARY")
                    .setDisabled(state)
                    .setCustomId("automod"),
            )
        ]

        const first = new MessageEmbed().setDescription("Please select the type of your warnings here.").setColor("BLUE").setFooter("You have 2 minutes to use this message")
        const msg = await message.reply({ embeds: [first], components: components(false) })

        const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 60000,
        })


        collector.on("collect", async (collected) => {

            if (collected.customId === "normal") {


                if (user) {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await warnModel.find({
                        userId: user.user.id,
                        guildId: message.guild.id,
                    });

                    const nowarns = new MessageEmbed().setDescription("That user doesn't have any normal warnings.").setColor("BLUE")
                    if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })

                    const embedDescription = userWarnings.map((warn, i) => {
                        const moderator = message.guild.members.cache.get(
                            warn.moderatorId
                        );

                        return [
                            `\`${i + 1}\`. **${warn.type}** | \`${warn._id}\``,
                            `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                            `> Moderator: ${moderator ? moderator.user.tag : "Moderator has left!"}`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");


                    const embed = new MessageEmbed()
                        .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
                        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`These are all the punishments for ${user.user}.\n\n${embedDescription}`)
                        .setColor("BLURPLE")

                    collected.update({ embeds: [embed] })

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
                            `\`${i + 1}\`. **${warn.type}** | \`${warn._id}\``,
                            `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                            `> Moderator: Hidden`,
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

                if (user) {

                    if (collected.user.id !== message.author.id) return collected.reply({ content: "This isn't your menu!", ephemeral: true })

                    const userWarnings = await automodModel.find({
                        userId: user.user.id,
                        guildId: message.guild.id,
                    });

                    const nowarns = new MessageEmbed().setDescription("That user doesn't have any automod warnings.").setColor("BLUE")
                    if (!userWarnings?.length) return collected.update({ embeds: [nowarns] })

                    const embedDescription = userWarnings.map((warn, i) => {

                        return [
                            `\`${i + 1}\`. **${warn.type}** | \`${warn._id}\``,
                            `> Date: <t:${~~(warn.date / 1000)}:f>`,
                            `> Moderator: Auto Moderation`,
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
                            `> Moderator: Auto Moderation`,
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