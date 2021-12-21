const { Client, CommandInteraction, MessageEmbed } = require("discord.js");



module.exports = {
    name: "suggest",
    description: `Suggest something for the server or the bot!`,
    ephemeral: true,
    botCommand: true,
    cooldown: 600000,
    options: [
        {
            name: 'suggestion',
            description: "What is your suggestion? Please provide it here with details!",
            required: true,
            type: "STRING",
        },
    ],


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const suggestchannel = client.channels.cache.get("851317000868462633")
        const suggestion = interaction.options.getString("suggestion")

        const thanks = new MessageEmbed()
            .setDescription(`${interaction.member.displayName}, thanks for your suggestion, it has been posted in <#851317000868462633>!`).setColor(`${client.color.botBlue}`)
        interaction.followUp({ embeds: [thanks] })

        const embed = new MessageEmbed()
            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
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