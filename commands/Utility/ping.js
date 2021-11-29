const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'ping',
    category : 'Bot Developer',
    description : 'Returns latency and API ping',
    aliases:['latency', 'uptime'],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let colors = {
            green: "#00FF00",
            yellow: "#FFFF00",
            red: "#FF0000"
        }

        let circles = {
            green: "<:green_circle:869807277731893258>",
            yellow: "<:yellow_circle:869807275785732127>",
            red: "<:red_circle:869807272992313345>"
        }


        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

            if(message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('VIEW_AUDIT_LOG')) {
            let ee = new MessageEmbed() 
             .setTitle(`Bot's latancy and uptime`)
             .setColor(`${Date.now() - message.createdTimestamp < 50 ? colors.green : client.ws.ping < 100 ? colors.yellow : colors.red}`)
             .setDescription(`${circles.green}: Excellent | ${circles.yellow}: Okey | ${circles.red}: Terrible`)
             .addField('Bot Latency', `${Date.now() - message.createdTimestamp < 50 ? circles.green : client.ws.ping < 100 ? circles.yellow : circles.red} \`${Date.now() - message.createdTimestamp}\`ms`, true)
             .addField("API Latency", `${Math.round(client.ws.ping) < 50 ? circles.green : client.ws.ping < 100 ? circles.yellow : circles.red} \`${Math.round(client.ws.ping)}\`ms`, true)
             .addField("Uptime", `\`${days}\` Days, \`${hours}\` Hours, \`${minutes}\` Minutes,\`${seconds}\` Seconds`, false)
            message.channel.send("Pinging...").then((m) => m.edit(ee))
            } else 
            return message.channel.send(noperm).then((m) => m.delete( { timeout: 5000 } )).then(() => message.delete())
            


        }


}


