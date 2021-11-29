const { MessageEmbed } = require('discord.js')
const db = require("../../models/MemberRoles.js")

module.exports = {
    name : 'unmute',
    category : 'moderation',
    description: `Unmutes an user`,
    usage: `[user]`,
    cooldown: 3000,
    userPermissions: ["BAN_MEMBERS"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed, modlog) => {

        var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first() 
        if(!args[0]) return message.reply({ embeds: [missingpartembed]})
        let erm = new MessageEmbed().setDescription(`${client.botEmoji.failed} Can't find that user!`).setColor(`${client.embedColor.failed}`)
        if(!user) return message.reply({ embeds: [erm] })


        let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't unmute that user!`).setColor(`${client.embedColor.failed}`)
        let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't unmute that user as they can't be muted!`).setColor(`${client.embedColor.failed}`)
        if (user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [xxpermbot] })
        if (user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [xxpermuser] })

            db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    data.content.map((w, i) => user.roles.set(w.roles))
                  await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

                  let mue = new MessageEmbed()
                  .setDescription(`${user.user} has been **unmuted**`)
                  .setColor(`${client.embedColor.moderation}`)
                message.channel.send({ embeds: [mue] }).then(message.delete())
       
                user.roles.remove("795353284042293319")
       
                let log = new MessageEmbed()
                .setAuthor(`Action: Unmute`, message.guild.iconURL({ dynamic: true }))
                .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
                .setColor(`${client.embedColor.logGreen}`)
                .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
                .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
                .setTimestamp()
                modlog.send({ embeds: [log]})
       
               } else {
                   let uu = new MessageEmbed().setDescription(`${client.botEmoji.failed} That user is not muted.`).setColor(`${client.embedColor.failed}`)
                   message.reply({ embeds: [uu]})

               }

        
              })


    }
}