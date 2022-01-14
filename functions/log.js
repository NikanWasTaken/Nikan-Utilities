const { WebhookClient, MessageActionRow, MessageButton, Client } = require("discord.js")
/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const moderationLogs =
        new WebhookClient({
            id: `910100385501433887`,
            token: `WDxlbcSouTKN5dKX65UaNvajh64Wb2OsXiKtDdmZgyS6Y9VtO22kD3E6YxrpgYMkVi5y`
        })

    const autoactionLogs =
        new WebhookClient({
            id: `917408937756741662`,
            token: `92dznvZixjZrgHLBYgERwS1ngRWcDSdldvhaaNlPpjHYyBDuwl6TbNyU4InU9nqTJIw8`
        })

    const automodLogs = new WebhookClient({
        id: `910104675716571136`,
        token: `mJQ3F73THOBgvp4E5QHQhJfL28k581qM1IDW88ctLyGLgozKF9U26ygQ_ahwIq4tHwpG`,
    });

    const colors = {
        "BAN": `#b3666c`,
        "WARN": "#f5d765",
        "DELETE": "#85ef93",
        "MUTE": "#fae673",
        "UNMUTE": "#87a7ec",
        "UNBAN": "#87a7ec",
        "KICK": "#f5d765",
        "EXPIRE": "#905de3"
    };


    async function actionLogFunction(options) {
        const _ = moderationLogs;
        const findUser = await client.users.fetch(`${options?.user}`)
        const findModerator = await client.users.fetch(`${options?.moderator}`)
        let logRow = new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL(`${options?.url}`).setLabel("Jump to the action"))
        _.send({
            embeds: [
                {
                    author: {
                        iconURL: client.user.displayAvatarURL(),
                        name: client.user.username,
                    },
                    title: `• ${client.cap(options?.type)}`,
                    color: `${colors[options?.color?.toUpperCase()]}`,
                    fields: [
                        {
                            name: `➜ User`,
                            value: `• ${findUser}\n• ${findUser?.tag}\n• ${options?.user}`,
                            inline: true
                        },
                        {
                            name: `➜ Moderator`,
                            value: `• ${findModerator}\n• ${findModerator.tag}\n• ${options?.moderator}`,
                            inline: true
                        },
                        {
                            name: "➜ Reason",
                            value: `${options?.reason}`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `ID: ${options?.id}`
                    },
                    timestamp: Date.now()
                }
            ],
            components: [logRow]
        }).catch(() => { });
    }

    async function autoActionLogFunction(options) {
        const _ = autoactionLogs;
        const findUser = await client.users.fetch(`${options?.user}`)
        _.send({
            embeds: [
                {
                    author: {
                        iconURL: client.user.displayAvatarURL(),
                        name: "Automatic Actions",
                    },
                    title: `• ${client.cap(options?.type)}`,
                    color: `${colors[options?.color?.toUpperCase()]}`,
                    fields: [
                        {
                            name: `User`,
                            value: `• ${findUser}`,
                            inline: true
                        },
                        {
                            name: `User Tag`,
                            value: `• ${findUser.tag}`,
                            inline: true
                        },
                        {
                            name: "User ID",
                            value: `${options?.user}`,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: `${options?.reason}`,
                            inline: false
                        }
                    ],
                    timestamp: Date.now()
                }
            ],
        }).catch((e) => { console.log(e) });
    }

    async function automodLogFuntion(options) {
        const _ = automodLogs;
        const findUser = await client.users.fetch(`${options?.user}`)
        const findChannel = await client.channels.fetch(`${options?.channel}`)
        _.send({
            embeds: [
                {
                    author: {
                        iconURL: client.user.displayAvatarURL(),
                        name: "Auto Moderation",
                    },
                    title: `• ${client.cap(options?.type)}`,
                    color: `${colors[options?.color?.toUpperCase()] || "WARN"}`,
                    fields: [
                        {
                            name: `User`,
                            value: `• ${findUser}`,
                            inline: true
                        },
                        {
                            name: `User Tag`,
                            value: `• ${findUser.tag}`,
                            inline: true
                        },
                        {
                            name: "User ID",
                            value: `${options?.user}`,
                            inline: true
                        },
                        {
                            name: "Channel",
                            value: `${findChannel}`,
                            inline: true
                        },
                        {
                            name: "Date & Time",
                            value: `<t:${options?.date}:f>`,
                            inline: true
                        },
                        {
                            name: "Content",
                            value: `${options?.content.length >= 1024 ? `The message content is too long to show!` : options?.content}`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `ID: ${options?.id}`
                    }
                }
            ],
        }).catch((e) => { console.log(e) });
    }

    client.log = {
        action: actionLogFunction,
        autoAction: autoActionLogFunction,
        automod: automodLogFuntion
    }

}