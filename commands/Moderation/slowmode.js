const { Message, Client } = require('discord.js')

module.exports = {
    name: 'slowmode',
    category: 'moderation',
    description: `Changes a channel's slowmode`,
    usage: '[limit in second]',
    aliases: ['sm'],
    cooldown: 3000,
    permissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {

        if (!args[0]) {

            switch (message.channel.rateLimitPerUser) {

                case 0:
                    message.reply({
                        content: "There is no slowmode on this channel!"
                    })
                    break

                default:
                    message.reply({
                        content: `There is currently a **${message.channel.rateLimitPerUser} second** slowmode!`
                    })
                    break;
            }

        } else {

            var limit = parseInt(args[0])
            if (isNaN(limit) && args[0].toLowerCase() != "off") {
                return message.reply({
                    content: "Slowmode rate must be a number!"
                }).then((msg) => {
                    client.delete.message(message, msg);
                })
            }

            if (limit > 21601) {
                return message.reply({
                    content: "You can't set the slowmode to more than 6 hours!"
                }).then((msg) => {
                    client.delete.message(message, msg);
                })
            }

            if (limit == message.channel.rateLimitPerUser) {
                return message.reply({
                    content: `The current slowmode is **${message.channel.rateLimitPerUser} second**, nothing changed!`
                });
            }

            if (limit < 1 || args[0].toLowerCase() == "off") {
                return message.reply({
                    content: "Slowmode has been turned off, woo hoo!"
                }).then(() => message.channel.setRateLimitPerUser("0"))
            }

            message.reply(
                limit == 1 ?
                    { content: `Slowmode has been changed to **${limit} second**!` } :
                    { content: `Slowmode has been changed to **${limit} seconds**!` }
            )
                .then(() => message.channel.setRateLimitPerUser(limit))

        }
    }
}