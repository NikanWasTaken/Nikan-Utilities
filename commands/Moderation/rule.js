const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'rule',
    category : 'moderation',
    description : 'Show members a quick view of a rule in the server using ">rule (rule number)".',
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

            if (message.member.hasPermission('MANAGE_MESSAGES')) {
        
        
            var rule1 = new MessageEmbed()
            .setTitle("Be Respectful")
             .setColor("#e6cc93")
             .setDescription("We expect all of my members to be respectful to everyone on this server. Joking is okay, but do not cross the line between joking and harrassing.")
             .setFooter("Rule 1")
        
        
             var rule2 = new MessageEmbed()
             .setTitle("No Spamming")
              .setColor("#e6cc93")
              .setDescription("Spamming is not allowed in this community. I also do not permit spamming in our voice chats. This can include soundboarding, transmitting music, yelling, excessively swearing, or intentionally disrupting other peoples’ conversations.")
              .setFooter("Rule 2")
        
        
              var rule3 = new MessageEmbed()
              .setTitle("All topics appropriate for children")
               .setColor("#e6cc93")
               .setDescription("please make sure all topics are appropriate for children. Nsfw is not allowed in this server, sending these will result in a ban!")
               .setFooter("Rule 3")
        
               var rule4 = new MessageEmbed()
               .setTitle("Keep your topics in the correct channel")
                .setColor("#e6cc93")
                .setDescription("Always keep your topics in right channels. You can check channel pin messages or channel descriptions for more info about the topics in  each channel.\nFor example, when you want to command server bots, send your command in <#800421771114709022> .Or if you want to chat with other people, send your messages in <#782837655082631229> . Check out <#795555448778129450>  to see the command channel for each bot.")
                .setFooter("Rule 4")
        
                var rule5 = new MessageEmbed()
                .setTitle("Don't ask for personal information")
                 .setColor("#e6cc93")
                 .setDescription("Please don't ask for personal information or distribute any personal information without consent.")
                 .setFooter("Rule 5")
        
                 var rule6 = new MessageEmbed()
                 .setTitle("You can only advertise yours and your friends things")
                  .setColor("#e6cc93")
                  .setDescription("You can advertise yours and your friends server, youtube and etc in <#807265233096933406> . If you advertise the servers that give free nitro for invites, you will be muted for a day!")
                  .setFooter("Rule 6")
        
                  let rule7 = new MessageEmbed()
                  .setTitle("Don't beg")
                   .setColor("#e6cc93")
                   .setDescription("Don't beg for nitro, server boost, roles, etc...\nBegging for things in staff dms will count as a rule breaking.")
                   .setFooter("Rule 7")
        
                   var rule8 = new MessageEmbed()
                   .setTitle("No Advertising")
                    .setColor("#e6cc93")
                    .setDescription(`DM advertising is not allowed, this includes saying "DM me for free nitro" or other items in chats. Advertise in only allowed in <#807265233096933406>.`)
                    .setFooter("Rule 8")
        
                    var rule9 = new MessageEmbed()
                    .setTitle("No swearing")
                     .setColor("#e6cc93")
                     .setDescription(`Do not swear in the server, or attempt to bypass the filter by changing the characters of a banned word.\n\n- Bad words bypass will result in a warn or mute.\n- Nsfw words bypass will result in a ban!`)
                     .setFooter("Rule 9")
        
        
                    var rule10 = new MessageEmbed()
                    .setTitle("Do not use alt accounts")
                     .setColor("#e6cc93")
                     .setDescription(`Using alts for nice stuff is ok, but don't join with your alts for maliciously actions.\n- Don't join giveaways to give yourself an unfair advantage.\n- Don't try to bypass a mute or ban given to your main account.`)
                     .setFooter("Rule 10")
        
                    var norule = new MessageEmbed()
                     .setDescription("<a:red_x:872203367718457424> Can not find that rule.")
                     .setColor("#ff0000")
        
           //----------------------------------
        
            var rule = args[0]
        
            if(rule === "1") return message.channel.send(rule1) 
            if(rule === "2") return message.channel.send(rule2) 
            if(rule === "3") return message.channel.send(rule3) 
            if(rule === "4") return message.channel.send(rule4) 
            if(rule === "5") return message.channel.send(rule5) 
            if(rule === "6") return message.channel.send(rule6) 
            if(rule === "7") return message.channel.send(rule7) 
            if(rule === "8") return message.channel.send(rule8) 
            if(rule === "9") return message.channel.send(rule9) 
            if(rule === "10") return message.channel.send(rule10) 
        
          else 
          message.channel.send(norule).then(message => message.delete({timeout: 5000})).then(() => message.delete())
          return
        
          } else
          message.channel.send(noperm).then(message => message.delete({timeout: 10000})).then(() => message.delete())
        }


}