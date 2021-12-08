const { MessageEmbed, WebhookClient, MessageAttachment, Message } = require('discord.js')

module.exports = {
    name: 'pog',
    category: 'Secret',
    description: 'poggr',
    cooldown: 2000,
    userPermissions: ["MANAGE_MESSAGES"],
    visible: false,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        const array = ["champy", "champ", "pogger", "poggr", "<a:poggr:915939849859653663>", "pogchampy", " pog + champy = <:pogchampy:915940863065096192> "]


        const boop = array[~~(Math.random() * array.length)]

        message.channel.send({ content: boop })

    }
}