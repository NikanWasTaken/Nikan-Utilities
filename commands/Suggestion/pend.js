const { MessageEmbed, WebhookClient } = require('discord.js')

module.exports = {
    name: 'pend-suggestion',
    category: 'suggestion',
    description: "Make a sugegstion pending in the suggestion channels.",
    usage: `[suggestion-id]`,
    cooldown: 3000,
    userPermissions: ["MOVE_MEMBERS"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed, modlog) => {

        const suggestionId = args[0]
        const suggestchannel = client.channels.cache.get("851317000868462633")

        if(!suggestionId) return message.reply({ embeds: [missingpartembed] })

        try {
            
        const oldembed = await suggestchannel.messages.fetch(`${suggestionId}`)

        const data = oldembed.embeds[0]
        const embed = new MessageEmbed()
         .setAuthor(`${data.author.name}`, `${data.author.iconURL}`)
         .setTitle("New Suggestion")
         .setURL(`${client.server.invite}`)
         .setColor("YELLOW")
         .addField("Suggestion", `${data.fields[0].value}`)
         .setFooter(`Suggestion ID: ${oldembed.id}`)
         .addField(`Status`, `<a:loading:800626613980495872> Pending...`)
         .setTimestamp()

         oldembed.edit({ embeds: [embed] })

         message.reply("Suggestion Status has been changed to pending!")

        } catch (error) {
            message.reply("Can't find a suggestion with the specified ID!")
        }



    }}