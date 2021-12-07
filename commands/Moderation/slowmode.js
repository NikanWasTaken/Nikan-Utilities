const { MessageEmbed } = require('discord.js')
const ms = require("ms")

module.exports = {
    name: 'slowmode',
    category: 'moderation',
    description: `Changes a channel's slowmode`,
    usage: '[limit in second]',
    aliases: ['sm'],
    cooldown: 3000,
    userPermissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {

        if (!args[0]) {

            message.reply(message.channel.rateLimitPerUser == 0 ? "There is no slowmode on this channel" : `The current slowmode is on **${limit}** seconds.**.`)

        } else {

            var limit = parseInt(args[0])
            if (limit > 21601) return message.reply("You can't set the slowmode to more than 6 hours!").then((msg) => {
                setTimeout(() => {
                    msg?.delete()
                    message?.delete()
                }, 5000)
            })

            if (limit == message.channel.rateLimitPerUser) return message.reply(`The current slowmode is \`${message.channel.rateLimitPerUser}\` second, Nothing changed.`)
                .then(() => message.channel.setRateLimitPerUser(limit))

            if (limit < 1) return message.reply("Slowmode has been turned off, go crazy!")
                .then(() => message.channel.setRateLimitPerUser("0"))

            message.reply(`${limit < 1 ? "Slowmode has been turned off, go crazy!" : `Slowmode has been set to ` + limit + ' seconds.'}`)
                .then(() => message.channel.setRateLimitPerUser(limit))

            message.channel.setRateLimitPerUser(limit);


        }


    }

}