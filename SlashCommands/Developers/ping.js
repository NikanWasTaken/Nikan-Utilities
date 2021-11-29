const { Client, CommandInteraction, MessageEmbed } = require("discord.js");


module.exports = {
    name: "ping",
    category: 'Developers',
    description: `Returns bot's latancy!`,
    cooldown: 5000,


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {



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
             .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
             .addField("**Latancy & Ping**", `Bot Ping • \`${Date.now() - interaction.createdTimestamp} ms\`\nOperating System • \`${Math.round(client.ws.ping)} ms\``)
             .addField("**Uptime**", `\`${days}\` Days • \`${hours}\` Hours • \`${minutes}\` Minutes • \`${seconds}\` Seconds\nSince • <t:${upvalue}:F>\nLast Restart • <t:${parseInt(client.readyTimestamp / 1000)}:R>`)
             .setFooter(`${client.user.username}`, client.user.displayAvatarURL())
            
             interaction.followUp({ embeds: [ee] })



    }
}