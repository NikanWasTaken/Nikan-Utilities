const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'kick',
    category : 'moderation',
    description : 'Kicking a member from the server using ">kick (user) (reason)". You can use both ID and mentioning in the user section.',
    usage:'KICK_MEMBER, Moderators',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {
       
        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")


        var modlog = new Discord.WebhookClient('842688628472021022', 'SSimpYCciyQL06O-XO0tSBS9BoLFzOv__kh7MD9_0F3pvp3elU_tYldf82lpoUEOICQo');

        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(noperm).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        var user = message.mentions.members.first() || message.guild.member(client.users.cache.find(user => user.id === args[0]))
        var xuser = new MessageEmbed().setDescription("<a:red_x:872203367718457424>  You should provide a user.").setColor("RED")
        if(!user) return message.channel.send(xuser).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        var ban = message.mentions.users.first() || client.users.cache.find(user => user.id === args[0])
        var reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"
        var youx = new MessageEmbed().setDescription(`<a:red_x:872203367718457424>  I can't not kick people with higher or same position as myself.`).setColor("RED")
        if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send(youx).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        var xx = new MessageEmbed().setDescription(`<a:red_x:872203367718457424>  You can't not kick people with higher or same position as yourself.`).setColor("RED")
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(xx).then(message => message.delete({timeout: 5000})).then(() => message.delete())
          
        var ff = new MessageEmbed().setDescription(`${user.user} has been **kicked** | ${reason}`).setColor("#e6cc93")
        message.channel.send(ff)
  
  
        var dmyes = new MessageEmbed()
        .setAuthor(`Nikan's Utilities`, client.user.displayAvatarURL( { dynamic:true } ))
        .setTitle(`You've been kicked from ${message.guild.name}`)
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
  
        user.kick()
        
  
        let embede = new MessageEmbed()
        .setAuthor(`Kick | ${ban.tag}`, ban.displayAvatarURL( { dynamic:true } ))
        .setColor("#42e9f5")
        .setTimestamp()
        .addFields({
          name: 'Member',
          value: `${user.user}`,
          inline: true
         }, {
          name: 'Moderator',
          value: `${message.author}`, 
          inline: true
         }, {
          name: "Reason",
          value: `${reason}`,
          inline: false
        });
   
       modlog.send(embede);
  
      }

}