const { MessageEmbed, MessageActionRow, MessageButton, WebhookClient, Client, Message } = require('discord.js')

module.exports = {
    name: 'selfrole',
    category: 'Secret',
    cooldown: 5000,
    visible: false,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {

        if (message.author.id !== client.config.owner) return message?.delete()

        const channel = new WebhookClient({
            token: "CByVo3PaAmO02vOp9GM3fJ-q1hZkR0GJVkeb4EKA-Oppe81Ai2stHb6Sb-NiHE0yg91x",
            id: "921116075423334491"
        })

        if (args[0] == "1") {

            const embed = new MessageEmbed()
                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Select a category below for a list of roles to choose from!")
                .setDescription("➜ Re-clicking a role that you already have will get it removed!\n\n** **")
                .setColor(`${client.color.serverPurple}`)
                .addFields(
                    {
                        name: "• Ping Roles",
                        value: "This category is about the roles which gets you pinged on certain events happened in the server.\n This includes giveaways, events, fact of the day etc..\n\n** **",
                        inline: false
                    },
                    {
                        name: "• Pronoun Roles",
                        value: "This category is about the roles which has nothing to offer.\n Just a role which tells other people your prefered pronoun(s).",
                        inline: false
                    }
                );

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("self-ping")
                    .setLabel("Ping Roles")
                    .setStyle("PRIMARY"),

                new MessageButton()
                    .setCustomId("self-pronoun")
                    .setLabel("Pronouns")
                    .setStyle("PRIMARY"),

                new MessageButton()
                    .setCustomId("self-organization")
                    .setLabel("Organize Your Roles")
                    .setStyle("SUCCESS"),


            );

            channel.send({ embeds: [embed], components: [row] })
            message.delete()

        } else if (args[0] == "2") {

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("Check Roles")
                    .setStyle("PRIMARY")
                    .setCustomId("self-check"),
                new MessageButton()
                    .setLabel("Reset Roles")
                    .setStyle("DANGER")
                    .setCustomId("self-reset")
            )

            const embed = new MessageEmbed()
                .setDescription("Not sure about your current self roles? Click the button below!")
                .setColor("ORANGE")

            channel.send({ embeds: [embed], components: [row] })

        }

    }
}