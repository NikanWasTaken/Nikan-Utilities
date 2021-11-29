const { MessageEmbed, WebhookClient } = require('discord.js')

module.exports = {
    name: 'accept-suggestion',
    category: 'suggestion',
    description: "Accepts a suggestion in the suggestion channels.",
    usage: `[suggestion-id] [accepting reason]`,
    cooldown: 3000,
    userPermissions: ["MOVE_MEMBERS"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed, modlog) => {

        const suggestionId = args[0]
        const suggestionReason = message.content.split(" ").slice(2).join(" ")
        const suggestchannel = client.channels.cache.get("851317000868462633")

        if(!suggestionId || !suggestionReason) return message.reply({ embeds: [missingpartembed] })

        try {
            
        const oldembed = await suggestchannel.messages.fetch(`${suggestionId}`)

        const data = oldembed.embeds[0]
        const embed = new MessageEmbed()
         .setAuthor(`${data.author.name}`, `${data.author.iconURL}`)
         .setColor("GREEN")
         .setTitle("Suggestion Approved")
         .setFooter(`Suggestion ID: ${oldembed.id}`)
         .addField(`${data.fields[0].name}`, `${data.fields[0].value}`)
         .addField(`Reason from ${message.author.tag}`, `${suggestionReason}`)
         .setTimestamp()

         oldembed.edit({ embeds: [embed] })

         message.reply("Suggestion Accepted!")

        } catch (error) {
            message.reply("Can't find a suggestion with the specified ID!")
        }



    }}