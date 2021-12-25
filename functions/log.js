const { WebhookClient, MessageActionRow, MessageButton } = require("discord.js")
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

    let actionLogFunction = async function (options) {
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

    let autoActionLogFunction = async function (options) {
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

    client.log = {
        action: actionLogFunction,
        autoAction: autoActionLogFunction
    }

}