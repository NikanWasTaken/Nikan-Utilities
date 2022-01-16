const { Message, Client } = require('discord.js')

module.exports = {
    name: 'afk',
    category: 'utility',
    description: 'Sets a afk',
    cooldown: 15000,
    usage: `<reason>`,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        let reason = args.join(" ") || "AFK"

        client.afk.set(message.author.id, [Date.now(), reason])

        message.reply({ content: `You are now AFK: ${reason}` }).then((msg) => {
            client.delete.message(message, msg)
        })

        message.member.setNickname(`[AFK] ${message.member.displayName}`)
            .catch(() => { return })

    }
}