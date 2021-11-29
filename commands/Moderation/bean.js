const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'bean',
    category : 'moderation',
    description : 'A fake ban command for just making people scared.',
    usage:'BAN_MEMBER, Moderators',

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
        var user = message.mentions.members.first() || message.guild.member(client.users.cache.find(user => user.id === args[0]))
        var xuser = new MessageEmbed().setDescription("<a:red_x:872203367718457424> You should provide a user.").setColor("RED")
        if(!user) return message.channel.send(xuser).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        var ban = message.mentions.users.first() || client.users.cache.find(user => user.id === args[0])
        var reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"
  
          
        var ff = new MessageEmbed().setDescription(`**${user.user.tag}** has been **beaned** | ${reason}`).setColor("#e6cc93")
        message.channel.send(ff)
  
  
        var dmyes = new MessageEmbed()
        .setAuthor(`Nikan's Utilities`, client.user.displayAvatarURL( { dynamic:true } ))
        .setTitle(`You've been beaned from ${message.guild.name}`)
        .setColor("#b3666c")
        .setTimestamp()
        .setFooter(`Server ID: ${message.guild.id}`)
        .addFields({
          name: "Moderator",
          value: message.author.tag
        }, {
          name: "Reason",
          value: reason
        })
    
        user.send(dmyes)
  
      }
  
    
    
}