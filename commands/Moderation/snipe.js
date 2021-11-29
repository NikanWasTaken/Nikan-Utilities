const { MessageEmbed } = require('discord.js')
const moment = require("moment")

module.exports = {
    name : 'snipe',
    category : 'moderation',
    description : `Snipe the recently deleted messages in a channel. (ignoring bot messages)`,
    usage:'Moderators',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")


        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(noperm).then(message => message.delete({timeout: 5000})).then(() => message.delete())

        const snipes = client.snipes.get(message.channel.id);
        if(!snipes) return message.reply("There is no recently deleted messages in this channel!")

        const snipe = +args[0] - 1 || 0;
        const target = snipes[snipe]; 
        if(!target) return message.reply(`Thire is only ${snipes.length} sniped messages!`)

        const { msg, time, image } = target; 

        let embed = new MessageEmbed()
         .setAuthor(msg.author.tag, msg.author.displayAvatarURL( { dynamic: true }))
         .setColor("RANDOM")
         .setImage(image)
         .setDescription(msg.content)
         .setFooter(`${moment(time).fromNow()} | ${snipe + 1} / ${snipes.length}`)

        message.channel.send(embed)




    }
}

