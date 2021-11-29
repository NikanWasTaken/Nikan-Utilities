const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'membercount',
    category : 'info',
    description : "Counting server's members.\n`>membercount --online`: count online members\n`>membercount --idle`: count idle members\n`>membercount --dnd`: count do not disturb members\n`>membercount --offline`: count offline members\n`>membercount --unverified`: count unverified members",
    usage:'<#800421771114709022>, <#844418140796092466>',
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


  
        
         var bb = new MessageEmbed()
            .setAuthor("Member Count", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription(`There are **${message.guild.members.cache.size}** members in this server`)
            .setColor("#a8bd91")
            .addFields({
              name: "Humans",
              value: `‌‌‌‌${message.guild.members.cache.filter(member => !member.user.bot).size}`,
              inline: true
            }, {
              name: "Bots",
              value: `‌‌‌‌${message.guild.members.cache.filter(member => member.user.bot).size}`,
              inline: true
            })
        
        
         var online = new MessageEmbed()
             .setAuthor("Online Member Count", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription(`There are **‌‌‌‌${message.guild.members.cache.filter(member => member.presence.status !== "offline").size}** online members in this server`)
            .setColor("#a8bd91")
        
         var idle = new MessageEmbed()
             .setAuthor("Idle Member Count", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription(`There are **‌‌‌‌${message.guild.members.cache.filter(member => member.presence.status === "idle").size}** idle members in this server`)
            .setColor("#a8bd91")
        
         var dnd = new MessageEmbed()
             .setAuthor("Do Not Disturb Member Count", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription(`There are **‌‌‌‌${message.guild.members.cache.filter(member => member.presence.status === "dnd").size}** dnd members in this server`)
            .setColor("#a8bd91")
        
         var offline = new MessageEmbed()
             .setAuthor("Offline Member Count", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription(`There are **‌‌‌‌${message.guild.members.cache.filter(member => member.presence.status === "offline").size}** offline members in this server`)
            .setColor("#a8bd91")
        
         var unverified = new MessageEmbed()
             .setAuthor("Unverified Member Count", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription(`There are **‌‌‌‌${message.guild.members.cache.filter(member => !member.hasPermission('VIEW_CHANNEL') && !member.user.bot).size}** unverified members in this server`)
            .setColor("#a8bd91")
        
        
         var nothing = new MessageEmbed()
            .setDescription("<a:red_x:872203367718457424> Can not find that advanced page for this command.")
            .setColor("#ff0000")
        
        
        
        ///////////---------------------------------------------------------------------------------------------------------------- 
        
        var advanced = args[0]
        
         if(!advanced) return message.channel.send(bb)
        
         if(advanced.toLowerCase() === "--online") return message.channel.send(online)
         if(advanced.toLowerCase() === "--idle") return message.channel.send(idle)
         if(advanced.toLowerCase() === "--dnd") return message.channel.send(dnd)
         if(advanced.toLowerCase() === "--offline") return message.channel.send(offline)
         if(advanced.toLowerCase() === "--unverified") return message.channel.send(unverified)
        
         else 
         message.channel.send(nothing).then(message => message.delete({timeout: 7000})).then(() => message.delete())
         return
        
        }
    
}