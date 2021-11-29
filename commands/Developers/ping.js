const { MessageEmbed } = require('discord.js')
const { mem, cpu, os } = require('node-os-utils');

module.exports = {
    name : 'ping',
    category : 'Developers',
    description : 'Returns latency and API ping',
    aliases:['latency', 'uptime'],
    cooldown: 5000,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

         const upvalue = (Date.now() / 1000 - client.uptime / 1000).toFixed(0);

            let ee = new MessageEmbed() 
             .setColor(`${client.embedColor.botBlue}`)
             .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
             .addField("**Latancy & Ping**", `Bot Ping • \`${Date.now() - message.createdTimestamp} ms\`\nOperating System • \`${Math.round(client.ws.ping)} ms\``)
             .addField("**Uptime**", `\`${days}\` Days • \`${hours}\` Hours • \`${minutes}\` Minutes • \`${seconds}\` Seconds\nSince • <t:${upvalue}:F>\nLast Restart • <t:${parseInt(client.readyTimestamp / 1000)}:R>`)
             .setFooter(`${client.user.username}`, client.user.displayAvatarURL())
            
             message.channel.sendTyping().then((msg) => {
                    message.reply({ embeds: [ee] })
            })
            

        }


}


