const { MessageEmbed, WebhookClient } = require('discord.js')
const warnModel = require("../../models/Punishments.js")

module.exports = {
    name : 'kick',
    category : 'moderation',
    description : 'Kicks a user from the server.',
    usage: `[user] <reason>`,
    cooldown: 3000,
    userPermissions: ["KICK_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed, modlog) => {

        var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()     

        if(!args[0]) return message.reply({ embeds: [missingpartembed]})
         var reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"

         let erm = new MessageEmbed().setDescription(`${client.botEmoji.failed} Can't find that user!`).setColor(`${client.embedColor.failed}`)
         if(!user) return message.reply({ embeds: [erm] })

         let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't kick that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
         let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't kick that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
         if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [xxpermbot]})
         if(user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [xxpermuser] })
          
         const data = new warnModel({
          type: "Kick",
          userId: user.user.id,
          guildId: message.guild.id,
          moderatorId: message.author.id,
          reason,
          timestamp: Date.now(),
      })

      data.save();

        var hmm = new MessageEmbed()
        .setDescription(`${user.user} has been **kicked** | \`${data._id}\``).setColor(`${client.embedColor.moderation}`)
        message.channel.send({ embeds: [hmm]}).then(message.delete())
  
        var dmyes = new MessageEmbed()
        .setAuthor(`Nikan's Utilities`, client.user.displayAvatarURL( { dynamic:true } ))
        .setTitle(`You've been kicked from ${message.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        .setFooter(`Server ID: ${message.guild.id}`)
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
    
        user.send({ embeds: [dmyes]}).catch(e => { return })
        

        user.kick({
          reason: reason,
        })
        
        let log = new MessageEmbed()
        .setAuthor(`Action: Kick`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logRed}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
        .addField("● Kick Info", `> Reason: ${reason}\n> Punishment ID: ${data._id}`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})


    }    
}