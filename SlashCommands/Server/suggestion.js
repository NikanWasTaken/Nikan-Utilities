const { Client, MessageEmbed } = require("discord.js");



module.exports = {
    name: "suggestion",
    description: `Suggestion sub commands for the server!`,
    botCommand: true,
    cooldown: 3000,
    permissions: ["MOVE_MEMBERS"],
    options: [
        {
            name: 'accept',
            description: "Accept the suggestion that was made in the server!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'suggestion-id',
                    description: "The ID of the suggestion you want to accept!",
                    required: true,
                    type: "STRING",
                },
                {
                    name: 'reason',
                    description: "What is the reason for you to accept this suggestion?",
                    required: true,
                    type: "STRING",
                }
            ]
        },
        {
            name: 'deny',
            description: "Deny the suggestion that was made in the server!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'suggestion-id',
                    description: "The ID of the suggestion you want to deny!",
                    required: true,
                    type: "STRING",
                },
                {
                    name: 'reason',
                    description: "What is the reason for you to deny this suggestion?",
                    required: true,
                    type: "STRING",
                }
            ]
        },
        {
            name: 'pend',
            description: "Make a suggestion's status that was made in the server pending!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'suggestion-id',
                    description: "The ID of the suggestion you want to pend!",
                    required: true,
                    type: "STRING",
                },
            ]
        },
    ],


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async ({ client, interaction }) => {

        const subs = interaction.options.getSubcommand(["accept", "deny", "pend"])

        if (subs === "accept") {

            const suggestionId = interaction.options.getString("suggestion-id")
            const suggestionReason = interaction.options.getString("reason")
            const suggestchannel = client.channels.cache.get("851317000868462633")

            try {

                const oldembed = await suggestchannel.messages.fetch(`${suggestionId}`)

                const data = oldembed.embeds[0]
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${data.author.name}`, iconURL: `${data.author.iconURL}` })
                    .setTitle("Suggestion Approved")
                    .setColor("GREEN")
                    .addField(`${data.fields[0].name}`, `${data.fields[0].value}`)
                    .addField(`Reason from ${interaction.user.tag}`, `${suggestionReason}`)
                    .setFooter({ text: `Suggestion ID: ${oldembed.id}` })
                    .setTimestamp()

                oldembed.edit({ embeds: [embed] })

                interaction.followUp("Suggestion Accepted!")

            } catch (error) {
                console.log(error)
                interaction.followUp("Can't find a suggestion with the specified ID!")

            }


        } else if (subs === "deny") {

            const suggestionId = interaction.options.getString("suggestion-id")
            const suggestionReason = interaction.options.getString("reason")
            const suggestchannel = client.channels.cache.get("851317000868462633")

            try {

                const oldembed = await suggestchannel.messages.fetch(`${suggestionId}`)

                const data = oldembed.embeds[0]
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${data.author.name}`, iconURL: `${data.author.iconURL}` })
                    .setColor("RED")
                    .setTitle("Suggestion Denied")
                    .setFooter({ text: `Suggestion ID: ${oldembed.id}` })
                    .addField(`${data.fields[0].name}`, `${data.fields[0].value}`)
                    .addField(`Reason from ${interaction.user.tag}`, `${suggestionReason}`)
                    .setTimestamp()

                oldembed.edit({ embeds: [embed] })

                interaction.followUp("Suggestion Denied!")

            } catch (error) {
                console.log(error)
                interaction.followUp("Can't find a suggestion with the specified ID!")
            }



        } else if (subs === "pend") {

            const suggestionId = interaction.options.getString("suggestion-id")
            const suggestchannel = client.channels.cache.get("851317000868462633")


            try {

                const oldembed = await suggestchannel.messages.fetch(`${suggestionId}`)

                const data = oldembed.embeds[0]
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${data.author.name}`, iconURL: `${data.author.iconURL}` })
                    .setTitle("New Suggestion")
                    .setURL(`${client.server.invite}`)
                    .setColor("YELLOW")
                    .addField("Suggestion", `${data.fields[0].value}`)
                    .setFooter({ text: `Suggestion ID: ${oldembed.id}` })
                    .addField(`Status`, `<a:loading:800626613980495872> Pending...`)
                    .setTimestamp()

                oldembed.edit({ embeds: [embed] })

                interaction.followUp("Suggestion Status has been changed to pending!")

            } catch (error) {
                console.log(error)
                interaction.followUp("Can't find a suggestion with the specified ID!")
            }
        }
    }
}