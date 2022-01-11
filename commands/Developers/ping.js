const { MessageEmbed, Client, Message } = require('discord.js')

module.exports = {
    name: 'ping',
    category: 'Developers',
    description: 'Returns latency and API ping',
    aliases: ['latency', 'uptime'],
    cooldown: 5000,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message) => {


        let embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .addField("<:ping:894097855759912970> Client", `• \`${Date.now() - message.createdTimestamp}ms\``, true)
            .addField("<:ping:894097855759912970> API", `• \`${Math.round(client.ws.ping)}ms\``, true)
            .addField("🕐 Uptime", `${client.convert.time(~~(client.uptime / 1000), { join: "•", bold: true })}`)
            .setColor(`${client.color.botBlue}`)

        message.reply({ embeds: [embed] })

    }
}


