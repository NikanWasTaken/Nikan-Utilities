const { MessageEmbed } = require('discord.js')
const randomnick = require("randomstring")

module.exports = {
    name: 'nickname',
    category: 'moderation',
    description: `Changes user's nickname.`,
    usage: '[user] [new nickname/reset/moderate]',
    aliases: ['nick'],
    cooldown: 3000,
    permissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {


        const cannotPerform = new MessageEmbed()
            .setDescription(`You don't have permissions to perform that action!`)
            .setColor("RED")

        var name = message.content.split(" ").slice(2).join(" ")
        var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

        if (!user) return message.reply({ embeds: [wrongUsage] })

        if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
            user.roles.highest.position >= message.member.roles.highest.position ||
            user.user.id === client.config.owner ||
            user.user.bot)
            return message.reply({ embeds: [cannotPerform] }).then((msg) => {
                setTimeout(() => {
                    msg?.delete()
                    message?.delete()
                }, 5000)
            })

        switch (name) {
            case "reset":

                const failedtochange1 = new MessageEmbed().setDescription("This user doesn't have a nickname!").setColor("RED")
                if (user.displayName === user.user.username)
                    return message.channel.send({ embeds: [failedtochange1] }).then((msg) => {
                        setTimeout(() => {
                            message?.delete()
                            msg?.delete()
                        }, 5000)
                    })

                const embed1 = new MessageEmbed()
                    .setDescription(`${user.user} nickname has been reset`)
                    .setColor(`${client.color.moderation}`)

                message.channel.send({ embeds: [embed1] })

                user.setNickname(`${user.user.username}`)

                break;
            case "mod":

                const nicknamegen = randomnick.generate({
                    length: 6,
                    charset: "alphanumeric"
                });
                const nickname1 = `Moderated Nickname ${nicknamegen}`

                const embed2 = new MessageEmbed()
                    .setDescription(`${user.user} nickname has been moderated!`)
                    .setColor(`${client.color.moderation}`)

                message.channel.send({ embeds: [embed2] })

                user.setNickname(`${nickname1}`)
                break;

            case "moderate":

                const nicknamegen1 = randomnick.generate({
                    length: 4,
                    charset: "alphanumeric"
                });
                const nickname2 = `Moderated Nickname ${nicknamegen1}`

                const embed3 = new MessageEmbed()
                    .setDescription(`${user.user} nickname has been moderated`)
                    .setColor(`${client.color.moderation}`)

                message.channel.send({ embeds: [embed3] })

                user.setNickname(`${nickname2}`)

            default:
                const failedtochange2 = new MessageEmbed().setDescription("You provided this user's current nickname!").setColor("RED")
                if (user.displayName === name)
                    return message.channel.send({ embeds: [failedtochange2] }).then((msg) => {
                        setTimeout(() => {
                            message?.delete()
                            msg?.delete()
                        }, 5000)
                    })

                const failedtochange3 = new MessageEmbed().setDescription("Nickname should be fewer than 32 characters in length!").setColor("RED")
                if (name.length > 32)
                    return message.channel.send({ embeds: [failedtochange3] }).then((msg) => {
                        setTimeout(() => {
                            message?.delete()
                            msg?.delete()
                        }, 5000)
                    })

                const embed4 = new MessageEmbed()
                    .setDescription(`${user.user} nickname has been changed to \`${name}\``)
                    .setColor(`${client.color.moderation}`)

                message.channel.send({ embeds: [embed4] })

                user.setNickname(`${name}`)
                break;
        }


    }
}