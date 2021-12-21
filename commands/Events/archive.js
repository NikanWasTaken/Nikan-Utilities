const { Client, MessageEmbed, Message } = require('discord.js')

module.exports = {
    name: 'event-archive',
    category: 'Events',
    description: "Arvchies the thread channel for your event!",
    cooldown: 10000,
    aliases: ["event-arch"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, wrongUsage) => {

        var noChannel = new MessageEmbed()
            .setDescription(`You may only use this command in the threads created in the <#880401081497157643> channel.`)
            .setColor("RED")

        var hostOnly = new MessageEmbed()
            .setDescription(`Only the event host can use this command!`)
            .setColor("RED")

        if (!message.member.roles.cache.get("880409157969256518")) return message.reply({ embeds: [client.embed.noPermissions] })
            .then((msg) => {
                setTimeout(() => {
                    msg.delete(), message.delete()
                }, 5000)
            })

        if (message.channel.parentId !== "880401081497157643") return message.reply({ embeds: [noChannel] })
            .then((msg) => {
                setTimeout(() => {
                    msg.delete(), message.delete()
                }, 5000)
            })

        if (message.channel.ownerId !== message.author.id) return message.reply({ embeds: [hostOnly] })
            .then((msg) => {
                setTimeout(() => {
                    msg.delete(), message.delete()
                }, 5000)
            })


        await message.react("✅")
        await message.channel.parent.permissionOverwrites.edit(message.guild.roles.everyone, {
            SEND_MESSAGES_IN_THREADS: false,

        })
        await message.channel.setArchived(true)


    }
}