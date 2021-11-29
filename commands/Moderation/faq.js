const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'faq',
    category : 'moderation',
    description : 'Show members a quick view of a faq in the server using ">faq (faq number)".',
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
        
        
            let faq1 = new MessageEmbed()
             .setTitle("How do I become a moderator?")
              .setColor("#e6cc93")
              .setDescription("You need to apply for staff application. To become a staff member, you must apply through our staff application. We open this when we need more staff members. This form is close in other times. ")
              .setFooter("Faq 1")
        
              let faq2 = new MessageEmbed()
              .setTitle("How can I get help from a staff member?")
               .setColor("#e6cc93")
               .setDescription("There are two ways:\n- Dm them or ping them in the chat | The staff list is available in <#833552244599029760>.\n- Dm <@814012282241286155>, the bot will send us a modmail and we will answer you through the bot.")
               .setFooter("Faq 2")
        
        
               let faq3 = new MessageEmbed()
               .setTitle("Why can't I advertise in #self-advertising?")
                .setColor("#e6cc93")
                .setDescription(`You need to have +15 level role, youtuber & twitch streamer to get access to that channel. 
                Get more info about these roles in <#827755503371157555>.`)
                .setFooter("Faq 3")
        
                let faq4 = new MessageEmbed()
                .setTitle("How can I host a giveaway in #giveaways-🎉?")
                 .setColor("#e6cc93")
                 .setDescription("You need to Dm a staff member or giveaway manager to host one. When you host 3 giveaways from this way, you will get giveaway manager role and you can host one whenever you want to.")
                 .setFooter("Faq 4")
        
                 let faq5 = new MessageEmbed()
                 .setTitle("How can I check my rank in the server?")
                  .setColor("#e6cc93")
                  .setDescription("You can receive XP to level up by sending a message every minute in the server. You can check your rank using `!rank`in <#800421771114709022> or !levels to check server's leaderboard.")
                  .setFooter("Faq 5")

                  let faq6 = new MessageEmbed()
                  .setTitle("How can I have the youtuber or twitch streamer role?")
                   .setColor("#e6cc93")
                   .setDescription("You can get them by dm'ing a head moderator or an admin in the server after your check the requirements in <#827755503371157555>.\n● Twitch Streamer: Having at least have 100 followers in Twitch.\n● Youtuber: Having at least have 100 subscribers in youtube.  ")
                   .setFooter("Faq 6")
        
                   let faq7 = new MessageEmbed()
                   .setTitle("How can I add Nikan's Utilities to my server?")
                    .setColor("#e6cc93")
                    .setDescription("Unfortunately this is a privately-owned custom bot, and it cannot invite it to other servers. But some good moderation bots are Dyno and Carl-bot.")
                    .setFooter("Faq 7")
        
                    let faq8 = new MessageEmbed()
                    .setTitle("Why can't I send links in the chat?")
                     .setColor("#e6cc93")
                     .setDescription("Usually links sent are malicious and people can accidentally click on them while in chat. To minimize this and keep all of our users safe, links are only allowed in <#810466123891998730>.")
                     .setFooter("Faq 8")
        
                     let faq9 = new MessageEmbed()
                     .setTitle("Why speaking in [x] language is prohibited?")
                      .setColor("#e6cc93")
                      .setDescription("Currently our staff team is comprised of English speakers, which means in the event that someone swears or says something inappropriate in another language we won’t be able to deal with them quickly. And also anther reason is that most of the people in the server are english speakers.")
                      .setFooter("Faq 9")
        
                      let faq10 = new MessageEmbed()
                      .setTitle("Why can't I send images in general?")
                       .setColor("#e6cc93")
                       .setDescription("You can only send image in general if you have Legendary inviter (+30) role, Designs or Arts role or server booster role. More information is available in <#827755503371157555>.")
                       .setFooter("Faq 10")
        
                    var nofaq = new MessageEmbed()
                     .setDescription("<a:red_x:872203367718457424> Can not find that faq.")
                     .setColor("#ff0000")
        
           //----------------------------------
        
            var rule = args[0]
        
            if(rule === "1") return message.channel.send(faq1) 
            if(rule === "2") return message.channel.send(faq2) 
            if(rule === "3") return message.channel.send(faq3) 
            if(rule === "4") return message.channel.send(faq4) 
            if(rule === "5") return message.channel.send(faq5) 
            if(rule === "6") return message.channel.send(faq6) 
            if(rule === "7") return message.channel.send(faq7) 
            if(rule === "8") return message.channel.send(faq8) 
            if(rule === "9") return message.channel.send(faq9) 
            if(rule === "10") return message.channel.send(faq10) 
        
          else 
          message.channel.send(nofaq).then(message => message.delete({timeout: 5000})).then(() => message.delete())
          return
        
          } else
          message.channel.send(noperm).then(message => message.delete({timeout: 10000})).then(() => message.delete())
        }


    }
