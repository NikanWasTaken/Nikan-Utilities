const { MessageEmbed } = require('discord.js')
const { afk } = require("../../models/afk")

module.exports = {
    name : 'afk',
    category : 'member',
    description : 'Set a custom afk for your self using ">afk (reason)".',
    usage:'<#800421771114709022>, <#844418140796092466>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

      
        let reason = args.join(" ") || "AFK"
      
          if (message.channel.id === '800421771114709022' || message.channel.id === "844418140796092466") {
          afk.set(message.author.id, [Date.now(), reason])
          message.member.setNickname(`[AFK] ${message.author.username}`)
          message.delete()
          message.channel.send(`<a:green_check:872203367047397426> ${message.author}, I set your afk!`).then((msg) => msg.delete( {timeout: 5000}))

          const embed = new MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setTitle(`Afk set in ${message.guild.name}`)
          .addField("Reason", reason, true)
          .setDescription("You may remove the afk by simply sending a message in the server!")
          .setColor("BLUE")

          message.member.send(embed)
       } else 
        message.channel.send(botcmd).then(message => message.delete({timeout: 10000}));
        
    }
      

    
}