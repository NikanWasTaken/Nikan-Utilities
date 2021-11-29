const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'unban',
    category : 'moderation',
    description : 'Unbanning the banned user from the server using ">unban (user ID)".',
    usage:'BAN_MEMBER, Moderators',
    aliases:['deban'],

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

        var banned = message.mentions.members.first() || args[0]
        if (message.member.hasPermission('BAN_MEMBERS')) {
        if(banned) {
       
           let userID = args[0]
       
             message.guild.fetchBans().then(bans=> {
             let BannedUser = bans.find(b => b.user.id == userID)
             var pll = new MessageEmbed() 
              .setDescription(`<a:red_x:872203367718457424> Can not find that user.`)
              .setColor("RED")
             if(!BannedUser) return message.channel.send(pll).then(message => message.delete({timeout: 5000})).then(() => message.delete())
             message.guild.members.unban(BannedUser.user)
             var pop = new MessageEmbed()
           .setDescription(`**${BannedUser.user.tag}** has been **unbanned** from the server.`)
           .setColor("#e6cc93")
          message.channel.send(pop)
           let embede = new MessageEmbed()
           .setTitle("Unban")
           .setColor("#ff0000")
           .setTimestamp()
           .addFields({
             name: 'Member',
             value: BannedUser.user.tag,
             inline: true
            }, {
             name: 'Moderator',
             value: message.author, 
             inline: true
           });
            modlog.send(embede);
       })
       
       
        } else 
        var hellobro = new MessageEmbed()
         .setDescription(`<a:red_x:872203367718457424> Please provide a user to unban.`)
         .setColor("RED")
         message.channel.send(hellobro).then(message => message.delete({timeout: 5000})).then(() => message.delete())
       
        } else 
         message.channel.send(noperm).then(message => message.delete({timeout: 10000})).then(() => message.delete())
       
        }

    
}