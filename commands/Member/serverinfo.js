const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'serverinfo',
    category : 'info',
    description : `Check server's information using ">serverinfo".`,
    usage:'<#800421771114709022>, <#844418140796092466>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

        if (message.channel.id === '800421771114709022' || message.channel.id === "844418140796092466") {
            let embed = new MessageEmbed()
            .setColor("#285DE3")
            .setAuthor(`${message.guild}`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(`ID: ${message.guild.id} | Created Date: ${message.guild.createdAt.toDateString()}`)
            .addField(`Owner`, `${message.guild.owner}`, true)
            .addField(`Region`, `${message.guild.region}`, true)
            .addField(`Verification`, `${message.guild.verificationLevel}`, true)
            .addField(`Emoji`, `${message.guild.emojis.cache.size}`, true)
            .addField(`Channel`, `${message.guild.channels.cache.size}`, true)
            .addField(`Roles`, `${message.guild.roles.cache.size}`, true)
           
            message.channel.send("Gathering server's info...").then((message)=> message.edit(embed))
           } else
                 message.channel.send(botcmd).then(message => message.delete({timeout: 10000}));
           }

           
    }