const { Client, CommandInteraction, MessageEmbed, Message, MessageActionRow, MessageButton, WebhookClient } = require("discord.js");
const modmailconfig = require("../../json/modmail.json");
const categoryId = modmailconfig.category;
const blacklist = require("../../models/modmail-blacklist.js")
const sourcebin = require("sourcebin")
let loghook = new WebhookClient({
    id: `${modmailconfig.hookId}`,
    token: `${modmailconfig.hookToken}`,
}); // https://discord.com/api/webhooks/910091774180081704/Reqy5hiVvGPp4HzaqnLNrhOQIt7X__2QwvQuNp2FzeetqZeEHbkbecPFNGdHyJ_QG6Ra



module.exports = {
    name: "modmail",
    description: `Actions on modmail!`,
    userPermissions: ["BAN_MEMBERS"],
    cooldown: 3000,
    options: [
        {
            name: "close",
            description: "Closes a modmail channel!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "reason",
                    description: "The reason you're closing this thread",
                    type: "STRING",
                    required: true
                }
            ]

        },
        {
            name: "blacklist",
            description: "Blacklists a person from opening modmail threads!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "action",
                    description: "The action you want to take on the user, add them or remove them!",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "Add to the blacklists!",
                            value: "add",
                        },
                        {
                            name: "Remove from the blacklists!",
                            value: "remove",
                        }
                    ]
                },
                {
                    name: "user",
                    description: "The user you want to blacklist!",
                    required: true,
                    type: "USER",
                },
                {
                    name: "reason",
                    description: "The reason of the blacklist!",
                    required: false,
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
    run: async (client, interaction, args) => {

        const serverId = client.server.id
        const subs = interaction.options.getSubcommand(["close", "blacklist"])

        if (subs == "close") {
            const reason = interaction.options.getString("reason") || "No reason provided";

            const channelblock = new MessageEmbed()
                .setDescription("You may only use this command in tickets channel from modmail category!").setColor(`${client.color.moderationRed}`);

            if (interaction.channel.parentId !== categoryId || interaction.channel.id === "880538350740725850" || interaction.channel.id === "885266382235795477") return interaction.followUp({ embeds: [channelblock] })

            const buttons = new MessageActionRow().addComponents(

                new MessageButton()
                    .setLabel("Close")
                    .setStyle("DANGER")
                    .setCustomId("delete-ticket"),

                new MessageButton()
                    .setLabel("Cancel")
                    .setStyle("SUCCESS")
                    .setCustomId("cancel-delete-ticket"),
            )

            const areusure = new MessageEmbed()
                .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                .setColor(`${client.color.botBlue}`)
                .setTitle("Are you sure that you want to close this thread?").setURL(`${client.server.invite}`)
                .setDescription("By accepting to close this thread, this channel will be deleted and you can't undo this action!\nAre you sure?")
                .setFooter(`You have 60 seconds to answer`, client.user.displayAvatarURL()).setTimestamp()

            const msg = await interaction.followUp({ embeds: [areusure], components: [buttons] })

            const collector = msg.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 60000,
            })

            collector.on('collect', async (collected) => {

                if (collected.customId === "cancel-delete-ticket") {
                    if (collected.user.id !== interaction.user.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

                    const embed = new MessageEmbed()
                        .setAuthor(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`)
                        .setTitle("Ticket Deletion Has Been Canceled").setURL(`${client.server.invite}`)
                        .setColor(`${client.color.failed}`)
                        .setDescription("The ticket deletion has been cancelled according to your button choice!")
                        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTimestamp()

                    await msg?.edit({ embeds: [embed], components: [] })

                } else if (collected.customId === "delete-ticket") {

                    if (collected.user.id !== interaction.user.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

                    const createdembed = new MessageEmbed()
                        .setAuthor(`${client.guilds.cache.get(serverId).name}`, `${interaction.guild.iconURL({ dynamic: true })}`)
                        .setTitle("Thread Deletion Confimred").setURL(`${client.server.invite}`)
                        .setColor(`${client.color.success}`)
                        .setDescription(`${client.emoji.loading} Saving the transcript...`)
                        .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                        .setTimestamp()

                    await msg?.edit({ embeds: [createdembed], components: [] })

                    const user = interaction.guild.members.cache.find(m => m.id === interaction.channel.name)
                    const fetch = await interaction.channel.messages.fetch({ limit: 100 })

                    const filtered = fetch.sort((a, b) => a.createdTimestamp - b.createdTimestamp).map((msg) => {
                        if (msg.author.bot) {

                            if (msg.embeds[0]?.footer?.text.endsWith(`${interaction.channel.name}`)) {
                                const getEmbed = msg.embeds[0];
                                return `${getEmbed?.author.name} :: ${getEmbed.description}`
                            }
                        } else if (!msg.author.bot) {

                            return `${msg?.author?.tag} :: ${msg?.content}`
                        }

                    }).join("\n")

                    const bin = await sourcebin.create(
                        [
                            {
                                content: `${filtered}`,
                                language: "AsciiDoc"
                            }
                        ],
                        {
                            title: `Modmail Transcript`,
                            description: `Modmail Transcript for the user: ${(await client.users.fetch(`${interaction.channel.name}`)).tag}`
                        }
                    )

                    const row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setLabel("Transcript")
                            .setStyle("LINK")
                            .setURL(`${bin.url}`)
                    )

                    const logembed = new MessageEmbed()
                        .setAuthor(`Ticket Closed`, interaction.guild.iconURL({ dynamic: true }))
                        .setColor(`${client.color.logYellow}`)
                        .addField('Ticket Opened By', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
                        .setTimestamp()
                    loghook.send({ embeds: [logembed], components: [row] })

                    await msg.edit({
                        embeds: [
                            createdembed.setDescription(`${client.emoji.success} Trascript Saved! This channel is going to be deleted in 10 seconds!`)
                        ]
                    })
                        .then((msg) => { setTimeout(() => { interaction?.channel?.delete() }, 10000) })

                }

            })

            collector.on("end", async (collected) => {

                const emobed = new MessageEmbed()
                    .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                    .setTitle("Thread Deletion Timed Out!").setURL(`${client.server.invite}`)
                    .setDescription("The thread deletion has been timed out and canceled due to your late respond! If you want to delete this thread, please run the \`/modmail close\` command again!")
                    .setColor("RED")
                    .setTimestamp()


                await msg?.edit({ embeds: [emobed], components: [] })
            })

        } else if (subs == "blacklist") {

            const action = interaction.options.getString("action")
            const user = interaction.options.getMember("user")
            const reason = interaction.options.getString("reason") || "No Reason Provided"


            if (action === "add") {

                const find = await blacklist.findOne({ userId: `${user.user.id}`, guildId: `${interaction.guild.id}` })

                if (!find) {

                    const data = new blacklist({
                        userId: `${user.user.id}`,
                        guildId: `${interaction.guild.id}`,
                        moderatorId: `${interaction.user.id}`,
                        reason: `${reason}`,
                        timestamp: Date.now(),
                    })
                    data.save()

                    const embed = new MessageEmbed()
                        .setDescription(`${user.user.tag} has been added to the modmail blacklist!`).setColor(`${client.color.moderation}`)

                    interaction.followUp({ embeds: [embed] })

                    let log = new MessageEmbed()
                        .setAuthor(`BlackList Added`, interaction.guild.iconURL({ dynamic: true }))
                        .setColor(`${client.color.logAqua}`)
                        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
                        .addField("● Information", `> Reason: ${reason}`, false)
                        .setTimestamp()

                    loghook.send({ embeds: [log] })

                } else {
                    return interaction.followUp({ content: "This user is already blacklisted!" })
                }

            } else if (action == "remove") {


                const find = await blacklist.findOne({ userId: `${user.user.id}`, guildId: `${interaction.guild.id}` })
                if (!find) return interaction.followUp({ content: "This user is not blacklisted!" })

                const embed = new MessageEmbed()
                    .setDescription(`${user.user.tag} has been removed from the modmail blacklist!`).setColor(`${client.color.moderation}`)

                await find.delete()
                interaction.followUp({ embeds: [embed] })

                let log = new MessageEmbed()
                    .setAuthor(`BlackList Removed`, interaction.guild.iconURL({ dynamic: true }))
                    .setColor(`${client.color.logGreen}`)
                    .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                    .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
                    .addField("● Information", `> Reason: ${reason}`, false)
                    .setTimestamp()

                loghook.send({ embeds: [log] })


            }

        }

    }
}