const { MessageEmbed } = require('discord.js')
const warnModel = require("../../models/Punishments.js")

module.exports = {
    name : 'unban',
    category : 'moderation',
    description : 'Unbans a banned member from the server',
    usage:'[user ID] <reason>',
    aliases:['deban'],
    cooldown: 5000,
    userPermissions: ["MOVE_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed, modlog) => {


        if(!args[0]) return message.reply({ embeds: [missingpartembed]})
        let userID = args[0]
        let reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"
       
             message.guild.bans.fetch().then(bans=> {
             let BannedUser = bans.find(b => b.user.id == userID)

             if(!BannedUser) return message.reply("Couldn't find that user in server's banned members!")
             message.guild.members.unban(BannedUser.user)

             const data = new warnModel({
              type: "Unban",
              userId: userID,
              guildId: message.guildId,
              moderatorId: message.author.id,
              reason,
              timestamp: Date.now(),
          })
            data.save()

          

             var pop = new MessageEmbed()
               .setDescription(`**${BannedUser.user.tag}** has been **unbanned** from the server.`)
               .setColor(`${client.embedColor.moderation}`)
             message.channel.send({ embeds: [pop]}).then(message.delete())

             let log = new MessageEmbed()
             .setAuthor(`Action: Unban`, message.guild.iconURL({ dynamic: true }))
             .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
             .setColor(`${client.embedColor.logAqua}`)
             .addField('Unbanned Member Info', `● ${BannedUser.user}\n> __Tag:__ ${BannedUser.user.tag}\n> __ID:__ ${BannedUser.user.id}`, true)
             .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
             .setTimestamp()
             modlog.send({ embeds: [log]})

             })
              
              }

}

    