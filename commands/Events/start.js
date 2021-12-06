const { MessageEmbed, WebhookClient, Message, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'event-start',
    category: 'Events',
    description: "Start an event by unlocking the thread!",
    cooldown: 10000,
    aliases: ["event-unlock"],


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args, missingpartembed) => {

        var noperm = new MessageEmbed()
            .setDescription(`You don't have permissions to run this command.`)
            .setColor("#b3666c")

        var nochannel = new MessageEmbed()
            .setDescription(`You may only use this command in the threads created in the <#880401081497157643> channel.`)
            .setColor("#b3666c")

        var hostonly = new MessageEmbed()
            .setDescription(`Only the event host can use this command!`)
            .setColor("#b3666c")

        if (!message.member.roles.cache.get("880409157969256518")) return message.reply({ embeds: [noperm] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })
        if (message.channel.parentId !== "880401081497157643") return message.reply({ embeds: [nochannel] })
        if (message.channel.ownerId !== message.author.id) return message.reply({ embeds: [hostonly] })

        await message.channel.parent.permissionOverwrites.edit(message.guild.roles.everyone, {
            SEND_MESSAGES_IN_THREADS: true,

        })

        await message.reply("The thread channel has been unlocked!")
    }
}