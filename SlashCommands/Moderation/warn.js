const { MessageEmbed, Client, MessageButton, MessageActionRow, CommandInteraction } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const moment = require("moment")
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
                {
                    name: "user-id",
                    description: "The ID of the user you want to check thier warns! - staff only!",
                    required: false,
                    type: "STRING",
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

    run: async (client, interaction) => {


        const subs = interaction.options.getSubcommand(["add", "remove", "list", "info"])

        if (subs == "add") {

            const user = interaction.options.getMember("user")
            const reason = interaction.options.getString("reason")

            if (!interaction.member.permissions.has("BAN_MEMBERS"))
                return interaction.followUp({ embeds: [client.embeds.noPermissions] }).then(() => {
                    client.delete.interaction(interaction);
                })

            if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
                user.roles.highest.position >= interaction.member.roles.highest.position ||
                user.user.id === client.config.owner ||
                user.user.bot)
                return interaction.followUp({ embeds: [client.embeds.cannotPerform] }).then(() => {
                    client.delete.interaction(interaction)
                })

            if (client.warncooldown.has(`${user.user.id}`)) {
                const embed = new MessageEmbed()
                    .setDescription("Whoops, looks like there is a double warning here!")
                    .setColor("RED")

                return interaction.followUp({ embeds: [embed] }).then(() => {
                    client.delete.interaction(interaction)
                })

            }

            const data = new warnModel({
                type: "Warn",
                userId: user.user.id,
                guildId: interaction.guildId,
                moderatorId: interaction.user.id,
                reason: reason,
                timestamp: Date.now(),
                expires: Date.now() + ms('4 weeks'),
                systemExpire: Date.now() + ms("4 weeks"),
            })
            data.save();


            let warndm = new MessageEmbed()
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .setTitle(`You've been warned in ${interaction.guild.name}.`)
                .addField("Punishment ID", `${data._id}`, true)
                .addField("Expires in", `4 weeks`, true)
                .addField("Reason", reason, false)
                .setColor(`${client.color.modDm}`)
            user.send({ embeds: [warndm] }).catch(() => { })

            let warned = new MessageEmbed()
                .setDescription(`${user} has been **warned** | \`${data._id}\``)
                .setColor(`${client.color.moderation}`)
            interaction.deleteReply()
            let msg = await interaction.channel.send({ embeds: [warned] })

            client.warncooldown.set(
                `${user.user.id}`,
            );
            setTimeout(() => {
                client.warncooldown.delete(`${user.user.id}`);
            }, 5000);

            client.log.action({
                type: "Warn",
                color: "WARN",
                user: `${user.user.id}`,
                moderator: `${interaction.user.id}`,
                reason: `${reason}`,
                id: `${data._id}`,
                url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
            })

            // ---- checks for 3 stikes, 6 and 9 strikes...

            const userWarnings = await warnModel.find({
                userId: user.user.id,
                guildId: interaction.guild.id,
                type: "Warn",
            });

            const numberofwarns = []

            userWarnings.map((i) => {
                numberofwarns.push(`${i + 1}`)
            })


            if (numberofwarns.length == 2) {

                await user.mute({
                    duration: "2h",
                    msg: interaction,
                    reason: reason,
                    auto: true
                })

            } else if (numberofwarns.length == 4) {

                await user.mute({
                    duration: "6h",
                    msg: message,
                    reason: reason,
                    auto: true
                })

            } else if (numberofwarns.length == 6) {

                const data2 = new warnModel({
                    type: "Ban",
                    userId: user.user.id,
                    guildId: interaction.guild.id,
                    moderatorId: `${client.user.id}`,
                    reason: "Reaching 6 Strikes",
                    timestamp: Date.now(),
                    systemExpire: Date.now() + ms("26 weeks"),
                })

                data2.save()

                const row2 = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("Appeal")
                        .setStyle("LINK")
                        .setURL(`${client.server.appeal}`)
                )

                let warndm = new MessageEmbed()
                    .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`You've been Banned from ${interaction.guild.name}`)
                    .addField("Punishment ID", `${data2._id}`, true)
                    .addField("Reason", "Reaching 6 strikes", false)
                    .setColor(`${client.color.modDm}`)
                    .setTimestamp()
                user.send({ embeds: [warndm], components: [row2] }).catch(() => { return })

                user.ban({
                    reason: "Reaching 6 stikes!"
                })

                client.log.autoAction({
                    type: "Ban",
                    color: "BAN",
                    user: `${user.user.id}`,
                    reason: `Reaching 6 normal warnings`
                });

            }


            // ------ eeeee

        } else if (subs == "remove") {

            if (!interaction.member.permissions.has("BAN_MEMBERS"))
                return interaction.followUp({ embeds: [client.embeds.noPermissions] })

            const warnId = interaction.options.getString("warn-id")

            try {

                const data = await warnModel.findById(`${warnId}`)
                data.delete()

                const user = await client.users.fetch(`${data?.userId}`) || "Can't find user!"

                let embed = new MessageEmbed()
                    .setDescription(`Punnishment \`${data._id}\` has been deleted!`)
                    .setColor(`${client.color.moderation}`)

                await interaction.deleteReply()
                let msg = await interaction.channel.send({ embeds: [embed] })

                client.log.action({
                    type: "Punishment Remove",
                    color: "DELETE",
                    user: `${user.id}`,
                    moderator: `${interaction.user.id}`,
                    reason: `• ID: ${data?._id}\n• Type: ${data?.type}\n• Reason: ${data?.reason}\n• Moderator: ${(await client.users.fetch(`${data?.moderatorId}`))?.tag || "I can't find them."}`,
                    id: `${data._id}`,
                    url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
                })

            } catch (error) {

                const embed = new MessageEmbed()
                    .setDescription(`A punishment with that ID doesn't exist in the database!`)
                    .setColor(`RED`)

                return interaction.followUp({ embeds: [embed] }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 5000)
                })

            }

        } else if (subs == "list") {

            let user;
            let member = interaction.options.getMember("member")
            if (member) user = interaction.options.getUser("member")
            if (!member) user = await client.users.fetch(`${interaction.options.getString("user-id")}`).catch(() => { })
            if (!interaction.options.getMember("member") && !interaction.options.getString("user-id")) {
                member = interaction.member,
                    user = interaction.user;
            }
            if (user === null || user === undefined) return interaction.followUp("This user doesn't exist!")
            const type = interaction.options.getString("type")

            if (type === "normal") {

                if (user.id !== interaction.user.id) {

                    const userWarnings = await warnModel.find({
                        userId: user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({
                        content: "That user doesn't have any normal warnings."
                    })

                    const embedDescription = userWarnings.map((warn, i) => {
                        let moderator;
                        if (interaction.guild.members.cache.get(warn.moderatorId)) moderator = interaction.guild.members.cache.get(warn.moderatorId).user.tag
                        if (!interaction.guild.members.cache.get(warn.moderatorId)) {
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


                    interaction.followUp({ embeds: [embed] })

                } else {

                    const userWarnings = await warnModel.find({
                        userId: user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({
                        content: "You don't have any normal punishments, completely clean!"
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
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${user} • ID: ${user?.id}\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    interaction.followUp({ embeds: [embed] })

                }

            } else if (type === "automod") {

                if (user.id !== interaction.user.id) {

                    const userWarnings = await automodModel.find({
                        userId: user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length) return interaction.followUp({ content: "That user doesn't have any automod warnings." })

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


                    interaction.followUp({ embeds: [embed] })

                } else {

                    const userWarnings = await automodModel.find({
                        userId: user.id,
                        guildId: interaction.guildId,
                    });

                    if (!userWarnings?.length)
                        return interaction.followUp({
                            content: "You don't have any automod punishments, completely clean!"
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
                        .setAuthor({ name: `${user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${user} • ID: ${user?.id}\n\n${embedDescription}`)
                        .setColor("BLURPLE")


                    interaction.followUp({ embeds: [embed] })

                }
            }

        } else if (subs == "info") {

            if (!interaction.member.permissions.has("BAN_MEMBERS"))
                return interaction.followUp({ embeds: [client.embeds.noPermissions] })
                    .then(() => {
                        client.delete.interaction(interaction)
                    })

            const punishid = interaction.options.getString("warn-id")

            const warnfind = await warnModel.findById(punishid).catch(() => { })
            if (!warnfind) return interaction.reply("Invalid warn ID!")
            const type = warnfind.type
            const user = interaction.guild.members.cache.get(warnfind.userId) || "User has left!"
            const reason = warnfind.reason
            const moderator = interaction.guild.members.cache.get(warnfind.moderatorId) || "Moderator Has left!"
            const date = `${moment(warnfind.timestamp).format("LT")} ${moment(warnfind.timestamp).format("LL")}`

            const embed = new MessageEmbed()
                .setAuthor({ name: `Punishment Information`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
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