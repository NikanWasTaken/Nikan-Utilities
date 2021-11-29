const { MessageEmbed } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const db = require("../../models/MemberRoles.js")


module.exports = {
    name : 'warn',
    category : 'moderation',
    description : `Warns a user in the server`,
    usage:'[user] [reason]',
    cooldown: 3000,
    userPermissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run : async(client, message, args, missingpartembed, modlog) => {


        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        const reason = args.slice(1).join(" ")
  
        if(!args[0] || !reason) return message.reply({ embeds: [missingpartembed]})
        let erm = new MessageEmbed().setDescription(`${client.botEmoji.failed} Can't find that user!`).setColor(`${client.embedColor.failed}`)
        if(!user) return message.reply({ embeds: [erm] })


        let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't warn that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
        let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't warn that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
        if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [xxpermbot]})
        if (user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [xxpermuser] })

        const data = new warnModel({
            type: "Warn",
            userId: user.user.id,
            guildId: message.guild.id,
            moderatorId: message.author.id,
            reason,
            timestamp: Date.now(),
        })
        data.save();

        let log = new MessageEmbed()
        .setAuthor(`Action: Warn`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.member.user}\n> __Tag:__ ${message.member.user.tag}\n> __ID:__ ${message.member.user.id}`, true)
        .addField("● Warn Info", `\n> Reason: ${reason}\n> Warn Id: ${data._id}`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})


        let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL( { dynamic: true } ))
        .setTitle(`You've been Warned in ${message.guild.name}`)
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        user.send({ embeds: [warndm]}).catch(e => { return })

        let warned = new MessageEmbed()
        .setDescription(`${user} has been **warned** | \`${data._id}\``)
        .setColor(`${client.embedColor.moderation}`)
       message.channel.send({ embeds: [warned]}).then(message.delete())

       // ---- checks for 3 stikes, 6 and 9 strikes...

       const userWarnings = await warnModel.find({
        userId: user.user.id,
        guildId: message.guild.id,
        type: "Warn",
       });

       const numberofwarns = []

       userWarnings.map((warn, i) => {
        numberofwarns.push(`${i + 1}`)
       })


    if(numberofwarns.length == 2) {

        const data = new db({
            guildid: message.guild.id,
            user: user.user.id,
            content: [{ roles: user.roles.cache.map(role => role.id), reason: "Collecting the roles after reaching 2 strikes mute!" }]
          })
          data.save()

          const data2 = new warnModel({
            type: "Mute",
            userId: user.user.id,
            guildId: message.guild.id,
            moderatorId: `${client.user.id}`,
            reason: "Reaching 2 Strikes",
            timestamp: Date.now(),
          })

          data2.save()

          user.roles.set(null).then(
            setTimeout(() => {
              user.roles.add("795353284042293319")
            }, 3000)
          )


        let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL( { dynamic: true } ))
        .setTitle(`You've been Muted in ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", "2 hours", true)
        .addField("Reason", "Reaching 2 strikes", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        user.send({ embeds: [warndm]}).catch(e => { return })

        let log = new MessageEmbed()
        .setAuthor(`Action: Mute`, message.guild.iconURL({ dynamic: true }))
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● Auto`, true)
        .addField("● Warn Info", `\n> Reason: Reaching 2 strikes\n> Warn Id: ${data._id}`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})


       setTimeout(async () => {

        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
          if (err) throw err;
          if (data) {
            data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
            await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })
          }
        })

        let log = new MessageEmbed()
        .setAuthor(`Action: Unmute`, message.guild.iconURL({ dynamic: true }))
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● Auto`, true)
        .addField("● Mute Info", `\n> Reason: Reaching 2 strikes`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})
        
      }, 7200000) // 2 hours

    } else if(numberofwarns.length == 4) {

        const data = new db({
            guildid: message.guild.id,
            user: user.user.id,
            content: [{ roles: user.roles.cache.map(role => role.id), reason: "Collecting the roles after reaching 4 strikes mute!" }]
          })
          data.save()

          const data2 = new warnModel({
            type: "Mute",
            userId: user.user.id,
            guildId: message.guild.id,
            moderatorId: `${client.user.id}`,
            reason: "Reaching 4 Strikes",
            timestamp: Date.now(),
          })

          data2.save()

          user.roles.set(null).then(
            setTimeout(() => {
              user.roles.add("795353284042293319")
            }, 3000)
          )


        let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL( { dynamic: true } ))
        .setTitle(`You've been Muted in ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", "6 hours", true)
        .addField("Reason", "Reaching 4 strikes", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        user.send({ embeds: [warndm]}).catch(e => { return })

        let log = new MessageEmbed()
        .setAuthor(`Action: Mute`, message.guild.iconURL({ dynamic: true }))
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● Auto`, true)
        .addField("● Warn Info", `\n> Reason: Reaching 4 strikes\n> Warn Id: ${data._id}`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})


       setTimeout(async () => {

        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
          if (err) throw err;
          if (data) {
            data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
            await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })
          }
        })

        let log = new MessageEmbed()
        .setAuthor(`Action: Unmute`, message.guild.iconURL({ dynamic: true }))
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● Auto`, true)
        .addField("● Mute Info", `\n> Reason: Reaching 4 strikes`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})
        
      }, 21600000) // 6 hours
        

    } else if(numberofwarns.length == 6) {


          const data2 = new warnModel({
            type: "Ban",
            userId: user.user.id,
            guildId: message.guild.id,
            moderatorId: `${client.user.id}`,
            reason: "Reaching 6 Strikes",
            timestamp: Date.now(),
          })

          data2.save()

        let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL( { dynamic: true } ))
        .setTitle(`You've been Banned from ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Reason", "Reaching 6 strikes", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        user.send({ embeds: [warndm]}).catch(e => { return })

        let log = new MessageEmbed()
        .setAuthor(`Action: Ban`, message.guild.iconURL({ dynamic: true }))
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● Auto`, true)
        .addField("● Punishment Info", `\n> Reason: Reaching 6 strikes\n> Punishment Id: ${data._id}`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})


        user.ban({
          reason: "Reaching 6 stikes!"
      })

    }


    },
};