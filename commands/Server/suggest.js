const { MessageEmbed, Message, Client } = require('discord.js')

module.exports = {
    name: 'suggest',
    category: 'server',
    description: 'Suggest something to the server using this command',
    usage: `[suggestion]`,
    cooldown: 120000,
    botCommand: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {

        const suggestchannel = client.channels.cache.get("851317000868462633")
        const suggestion = args.join(" ")

        if (!suggestion) return message.reply("Please state your suggestion!")

        const thanks = new MessageEmbed()
            .setDescription(`${message.member.displayName}, thanks for your suggestion, it has been posted in <#851317000868462633>!`).setColor("BLUE")
        message.channel.send({ embeds: [thanks] })
        message.delete()

        const embed = new MessageEmbed()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTitle("New Suggestion")
            .setURL(`${client.server.invite}`)
            .setColor("YELLOW")
            .addField("Suggestion", `${suggestion}`)
            .addField("Status", "<a:loading:800626613980495872> Pending...")
            .setTimestamp()

        suggestchannel.send({ embeds: [embed] }).then((msg) => {

            msg.edit({ embeds: [embed.setFooter(`Suggestion ID: ${msg.id}`)] })
            msg.react("<a:NUupvote:902915217829273661>")
            msg.react("<a:NUdownvote:902915218353569802>")

        })
    }
}