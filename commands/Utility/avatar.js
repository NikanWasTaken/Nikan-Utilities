const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'avatar',
    category: 'utility',
    description: `Shows a user's avatar/profile picture.`,
    aliases: ["av", "pfp"],
    cooldown: 5000,
    usage: `[user]`,
    botCommand: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {


        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const avatarEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`${user.user.username}'s Avatar Preview `)
            .setURL(user.user.displayAvatarURL({ dynamic: true }))
            .setImage(user.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter(`Requested by ${message.member.user.username}`, message.member.user.displayAvatarURL({ dynamic: true }))
        message.reply({ embeds: [avatarEmbed] })

    }
}