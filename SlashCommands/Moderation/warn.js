const { MessageEmbed } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const moment = require("moment")
const db = require("../../models/MemberRoles.js");
const ms = require("ms")


module.exports = {
    name: 'warn',
    description: `Warns a member!`,
    options: [
        {
            name: "add",
            description: "Warns a user in the guild!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "The user you want to warn!",
                    required: true,
                    type: "USER",
                },
                {
                    name: "reason",
                    description: "The reason of the warn!",
                    required: true,
                    type: "STRING",
                },

            ]

        },
        {
            name: "remove",
            description: "Removes a warns for an user in the guild!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "warn-id",
                    description: "The ID of the warn you want to remove!",
                    required: true,
                    type: "STRING",
                },
            ]

        },
        {
            name: "list",
            description: "Shows the warns for a user in the guild!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "type",
                    description: "The type of your warnings you want to show, automod? normal?",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "Normal Strikes given by moderators to you!",
                            value: "normal",
                        },
                        {
                            name: "Auto Moderation Strikes",
                            value: "automod"
                        }
                    ]
                },
                {
                    name: "member",
                    description: "The user you want to check thier warns! - staff only!",
                    required: false,
                    type: "USER",
                },
            ]

        },
        {
            name: "info",
            description: "Shows information about a warn ID!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "warn-id",
                    description: "The id of the warn you want to get information about!",
                    required: true,
                    type: "STRING",
                },
            ]

        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args, modlog) => {

        const subs = interaction.options.getSubcommand(["add", "remove", "list", "info"])
        const nopermsmh = new MessageEmbed().setDescription("You don't have permissions to permit this command!").setColor(`${client.embedColor.moderationRed}`)

        if (subs == "add") {

            const user = interaction.options.getMember("user")
            const reason = interaction.options.getString("reason")

            if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.followUp({ embeds: [nopermsmh] })

            let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't warn that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
            let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't warn that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
            if (user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot] })
            if (user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })

            const data = new warnModel({
                type: "Warn",
                userId: user.user.id,
                guildId: interaction.guildId,
                moderatorId: interaction.user.id,
                reason,
                timestamp: Date.now(),
                expires: Date.now() + ms('4 weeks')
            })
            data.save();

            let log = new MessageEmbed()
                .setAuthor(`Action: Warn`, interaction.guild.iconURL({ dynamic: true }))
                .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
                .setColor(`${client.embedColor.logYellow}`)
                .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
                .addField("● Warn Info", `\n> Reason: ${reason}\n> Warn ID: ${data._id}`, false)
                .setTimestamp()

            modlog.send({ embeds: [log] })


            let warndm = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`You've been warned in ${interaction.guild.name}.`)
                .addField("Punishment ID", `${data._id}`, true)
                .addField("Expires in", `4 weeks`, true)
                .addField("Reason", reason, false)
                .setColor(`${client.embedColor.modDm}`)
            user.send({ embeds: [warndm] }).catch(e => { return })

            let warned = new MessageEmbed()
                .setDescription(`${user} has been **warned** | \`${data._id}\``)
                .setColor(`${client.embedColor.moderation}`)
            interaction.followUp({ embeds: [warned] })

            // ---- checks for 3 stikes, 6 and 9 strikes...

            const userWarnings = await warnModel.find({
                userId: user.user.id,
                guildId: interaction.guild.id,
                type: "Warn",
            });

            const numberofwarns = []

            userWarnings.map((warn, i) => {
                numberofwarns.push(`${i + 1}`)
            })


            if (numberofwarns.length == 2) {

                const data = new db({
                    guildid: interaction.guild.id,
                    user: user.user.id,
                    content: [{ roles: user.roles.cache.map(role => role.id), reason: "Collecting the roles after reaching 2 strikes mute!" }]
                })
                data.save()

                const data2 = new warnModel({
                    type: "Mute",
                    userId: user.user.id,
                    guildId: interaction.guild.id,
                    moderatorId: `${client.user.id}`,
                    reason: "Reaching 2 Strikes",
                    timestamp: Date.now(),
                })

                data2.save()

                user.roles.set(null).then(
                    setTimeout(() => {
                        user.roles.add("795353284042293319")
                    }, 3000)
                )


                let warndm = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`You've been Muted in ${interaction.guild.name}`)
                    .addField("Punishment ID", `${data2._id}`, true)
                    .addField("Duration", "2 hours", true)
                    .addField("Reason", "Reaching 2 strikes", false)
                    .setColor(`${client.embedColor.modDm}`)
                    .setTimestamp()
                user.send({ embeds: [warndm] }).catch(e => { return })

                let log = new MessageEmbed()
                    .setAuthor(`Action: Mute`, interaction.guild.iconURL({ dynamic: true }))
                    .setColor(`${client.embedColor.logYellow}`)
                    .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                    .addField("Mod Info", `● Auto`, true)
                    .addField("● Warn Info", `\n> Reason: Reaching 2 strikes\n> Warn Id: ${data._id}`, false)
                    .setTimestamp()

                modlog.send({ embeds: [log] })


                setTimeout(async () => {

                    db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
                        if (err) throw err;
                        if (data) {
                            data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
                            await db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })
                        }
                    })

                    let log = new MessageEmbed()
                        .setAuthor(`Action: Unmute`, interaction.guild.iconURL({ dynamic: true }))
                        .setColor(`${client.embedColor.logYellow}`)
                        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                        .addField("Mod Info", `● Auto`, true)
                        .addField("● Mute Info", `\n> Reason: Reaching 2 strikes`, false)
                        .setTimestamp()

                    modlog.send({ embeds: [log] })

                }, 7200000) // 2 hours

            } else if (numberofwarns.length == 4) {

                const data = new db({
                    guildid: interaction.guild.id,
                    user: user.user.id,
                    content: [{ roles: user.roles.cache.map(role => role.id), reason: "Collecting the roles after reaching 4 strikes mute!" }]
                })
                data.save()

                const data2 = new warnModel({
                    type: "Mute",
                    userId: user.user.id,
                    guildId: interaction.guild.id,
                    moderatorId: `${client.user.id}`,
                    reason: "Reaching 4 Strikes",
                    timestamp: Date.now(),
                })

                data2.save()

                user.roles.set(null).then(
                    setTimeout(() => {
                        user.roles.add("795353284042293319")
                    }, 3000)
                )


                let warndm = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`You've been Muted in ${interaction.guild.name}`)
                    .addField("Punishment ID", `${data2._id}`, true)
                    .addField("Duration", "6 hours", true)
                    .addField("Reason", "Reaching 4 strikes", false)
                    .setColor(`${client.embedColor.modDm}`)
                    .setTimestamp()
                user.send({ embeds: [warndm] }).catch(e => { return })

                let log = new MessageEmbed()
                    .setAuthor(`Action: Mute`, interaction.guild.iconURL({ dynamic: true }))
                    .setColor(`${client.embedColor.logYellow}`)
                    .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                    .addField("Mod Info", `● Auto`, true)
                    .addField("● Warn Info", `\n> Reason: Reaching 4 strikes\n> Warn Id: ${data._id}`, false)
                    .setTimestamp()

                modlog.send({ embeds: [log] })


                setTimeout(async () => {

                    db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
                        if (err) throw err;
                        if (data) {
                            data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
                            await db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })
                        }
                    })

                    let log = new MessageEmbed()
                        .setAuthor(`Action: Unmute`, interaction.guild.iconURL({ dynamic: true }))
                        .setColor(`${client.embedColor.logYellow}`)
                        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                        .addField("Mod Info", `● Auto`, true)
                        .addField("● Mute Info", `\n> Reason: Reaching 4 strikes`, false)
                        .setTimestamp()

                    modlog.send({ embeds: [log] })

                }, 21600000) // 6 hours


            } else if (numberofwarns.length == 6) {


                const data2 = new warnModel({
                    type: "Ban",
                    userId: user.user.id,
                    guildId: interaction.guild.id,
                    moderatorId: `${client.user.id}`,
                    reason: "Reaching 6 Strikes",
                    timestamp: Date.now(),
                })

                data2.save()


                let warndm = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`You've been Banned from ${interaction.guild.name}`)
                    .setDescription(`You can appeal this ban by clicking [here](https://forms.gle/dW8RGLA65ycC4vcM7).`)
                    .addField("Punishment ID", `${data2._id}`, true)
                    .addField("Reason", "Reaching 6 strikes", false)
                    .setColor(`${client.embedColor.modDm}`)
                    .setTimestamp()
                user.send({ embeds: [warndm] }).catch(e => { return })

                let log = new MessageEmbed()
                    .setAuthor(`Action: Ban`, interaction.guild.iconURL({ dynamic: true }))
                    .setColor(`${client.embedColor.logYellow}`)
                    .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                    .addField("Mod Info", `● Auto`, true)
                    .addField("● Punishment Info", `\n> Reason: Reaching 6 strikes\n> Punishment Id: ${data._id}`, false)
                    .setTimestamp()

                modlog.send({ embeds: [log] })


                user.ban({
                    reason: "Reaching 6 stikes!"
                })

            }


            // ------ eeeee

        } else if (subs == "remove") {

            if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.followUp({ embeds: [nopermsmh] })

            const warnId = interaction.options.getString("warn-id")
            const data = await warnModel.findById(warnId).catch(e => { return })
            if (!data) return interaction.followUp("The warn ID is not valid.")
            data.delete()

            const user = interaction.guild.members.cache.get(data.userId) || "User not found!"
            const embed = new MessageEmbed()
                .setDescription(`Removed the punishment with the ID \`${warnId}\`\n From the user: ${user.user}`)
                .setColor(`${client.embedColor.moderation}`)
            interaction.followUp({ embeds: [embed] })

            let log = new MessageEmbed()
                .setAuthor(`Action: Remove Punishment`, interaction.guild.iconURL({ dynamic: true }))
                .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
                .setColor(`${client.embedColor.logGreen}`)
                .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
                .addField("● Punishment Info", `> Warn ID: ${warnId}.\n`, false)
                .setTimestamp()

            modlog.send({ embeds: [log] })

        } else if (subs == "list") {

            const user = interaction.options.getMember("member")
            const type = interaction.options.getString("type")

            if (type === "normal") {

                if (user) {

                    let no = new MessageEmbed().setDescription('You can only check your own warnings').setColor(`${client.embedColor.moderationRed}`)
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.followUp({ embeds: [no] })

                    const userWarnings = await warnModel.find({
                        userId: user.user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({ content: "That user doesn't have any normal warnings." })

                    const embedDescription = userWarnings.map((warn, i) => {
                        const moderator = interaction.guild.members.cache.get(
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


                    interaction.followUp({ embeds: [embed] })

                } else {

                    var botcmd = new MessageEmbed().setDescription('You may only use this command in bot command channels!').setColor(`${client.embedColor.moderationRed}`)
                    if (!interaction.channel.name.includes("command")) return interaction.followUp({ embeds: [botcmd] })

                    const userWarnings = await warnModel.find({
                        userId: interaction.user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({ content: "You don't have any normal punishments, completely clean!" })

                    const embedDescription = userWarnings.map((warn, i) => {
                        const moderator = interaction.guild.members.cache.get(
                            warn.moderatorId
                        );

                        return [
                            `\`${i + 1}\`. **${warn.type}** | \`${warn._id}\``,
                            `> Date: <t:${~~(warn.timestamp / 1000)}:f>`,
                            `> Moderator: Hidden`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");

                    const embed = new MessageEmbed()
                        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`These are all the punishments for ${interaction.user}.\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    interaction.followUp({ embeds: [embed] })

                }

            } else if (type === "automod") {

                if (user) {

                    let no = new MessageEmbed().setDescription('You can only check your own warnings').setColor(`${client.embedColor.moderationRed}`)
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.followUp({ embeds: [no] })

                    const userWarnings = await automodModel.find({
                        userId: user.user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({ content: "That user doesn't have any automod warnings." })

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
                        .setDescription(`These are all the punishments for ${user.user}.\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    interaction.followUp({ embeds: [embed] })

                } else {

                    var botcmd = new MessageEmbed().setDescription('You may only use this command in bot command channels!').setColor(`${client.embedColor.moderationRed}`)
                    if (!interaction.channel.name.includes("command")) return interaction.followUp({ embeds: [botcmd] })

                    const userWarnings = await automodModel.find({
                        userId: interaction.user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({ content: "You don't have any automod punishments, completely clean!" })

                    const embedDescription = userWarnings.map((warn, i) => {

                        return [
                            `\`${i + 1}\`. **${warn.type}** | \`${warn._id}\``,
                            `> Date: <t:${~~(warn.date / 1000)}:f>`,
                            `> Moderator: Auto Moderation`,
                            `> Reason: ${warn.reason}`,
                        ].join("\n");
                    }).join("\n\n");

                    const embed = new MessageEmbed()
                        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`These are all the punishments for ${interaction.user}.\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    interaction.followUp({ embeds: [embed] })

                }

            }



        } else if (subs == "info") {

            const punishid = interaction.options.getString("warn-id")

            const warnfind = await warnModel.findById(punishid)
            if (!warnfind) return interaction.reply("Invalid warn ID!")
            const type = warnfind.type
            const user = interaction.guild.members.cache.get(warnfind.userId) || "User has left!"
            const reason = warnfind.reason
            const moderator = interaction.guild.members.cache.get(warnfind.moderatorId) || "Moderator Has left!"
            const date = `${moment(warnfind.timestamp).format("LT")} ${moment(warnfind.timestamp).format("LL")}`

            const embed = new MessageEmbed()
                .setAuthor(`Punishment Information`, interaction.guild.iconURL({ dynamic: true }))
                .setDescription(`Information for the punishment Id: \`${punishid}\``)
                .setColor("RANDOM")
                .addField("● Punishment Type", `${type}`, true)
                .addField("● Moderator", `> Moderator: ${moderator}\n> ID: ${warnfind.moderatorId}`, false)
                .addField("● Punished User", `> User: ${user}\n> ID: ${warnfind.userId}`, false)
                .addField("● Reason", `${reason}`, false)
                .addField("● Date & Time", `${date}`, false)

            interaction.followUp({ embeds: [embed] })

        }

    },
};