const { MessageEmbed } = require('discord.js')
const moment = require("moment")

module.exports = {
    name: 'snipe',
    category: 'moderation',
    description: `Snipes the recently deleted messages in a channel`,
    usage: '<sniped message number>',
    cooldown: 3000,
    permissions: ["BAN_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async ({ client, message, args }) => {


        const snipes = client.snipes.get(message.channel.id);
        if (!snipes) return message.reply("There is no recently deleted messages in this channel!")

        const snipe = +args[0] - 1 || 0;
        const target = snipes[snipe];
        if (!target) return message.reply(`Thire is only ${snipes.length} sniped messages!`)

        const { msg, time, image } = target;

        let embed = new MessageEmbed()
            .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
            .setColor("RANDOM")
            .setImage(image)
            .setDescription(msg.content)
            .setFooter(`${moment(time).fromNow()} | ${snipe + 1} / ${snipes.length}`)

        message.channel.send({ embeds: [embed] })


    }
}

