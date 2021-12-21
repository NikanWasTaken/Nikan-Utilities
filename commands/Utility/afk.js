const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'afk',
    category: 'utility',
    description: 'Sets a afk',
    cooldown: 15000,
    botCommand: true,
    usage: `<reason>`,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        let reason = args.join(" ") || "AFK"

        client.afk.set(message.author.id, [Date.now(), reason])

        let no = new MessageEmbed()
            .setDescription(`✅ I set your AFK for the reason: ${reason}`)
            .setColor("GREEN")
        message.reply({ embeds: [no] }).then((msg) => {
            setTimeout(() => {
                msg.delete()
                message.delete()
            }, 5000)
        })

        message.member.setNickname(`[AFK] ${message.author.username}`).catch(e => { return })


    }



}