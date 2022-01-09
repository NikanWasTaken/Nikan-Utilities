const { Client, MessageEmbed } = require("discord.js");


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
    run: async ({ client, interaction }) => {

        let embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
            .addField("<:ping:894097855759912970> Client", `• \`${Date.now() - interaction.createdTimestamp}ms\``, true)
            .addField("<:ping:894097855759912970> API", `• \`${Math.round(client.ws.ping)}ms\``, true)
            .addField("🕐 Uptime", `${client.convert.time(process.uptime(), { join: "•", bold: true })}`)
            .setColor(`${client.color.serverPurple}`)

        interaction.followUp({ embeds: [embed] })




    }
}