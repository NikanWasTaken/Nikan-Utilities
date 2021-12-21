const { MessageEmbed } = require('discord.js')

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

    run: async (client, message, args) => {


        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        // const upvalue = (Date.now() / 1000 - client.uptime / 1000).toFixed(0);

        let embed = new MessageEmbed()
            .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
            .addField("<:ping:894097855759912970> Bot", `• \`${Date.now() - message.createdTimestamp}ms\``, true)
            .addField("<:ping:894097855759912970> Operate", `• \`${Math.round(client.ws.ping)}ms\``, true)
            .addField("🕐 Uptime", `**${days}** Days • **${hours}** Hours • **${minutes}** Minutes • **${seconds}** Seconds`)
            .setColor(`${client.color.cool}`)

        message.reply({ embeds: [embed] })

    }


}


