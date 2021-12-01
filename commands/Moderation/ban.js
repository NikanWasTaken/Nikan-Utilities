const { MessageEmbed, WebhookClient } = require('discord.js')
const warnModel = require("../../models/Punishments.js")

module.exports = {
  name: 'ban',
  category: 'moderation',
  description: 'Bans a member from the server',
  usage: `[user] <reason>`,
  cooldown: 2000,
  userPermissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed, modlog) => {

    let reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"
    let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    if (!args[0]) return message.reply({ embeds: [missingpartembed] })


    if (!user) {

      try {

        var user2 = await message.guild.members.ban(`${args[0]}`, { reason: reason })


        const data = new warnModel({
          type: "Ban",
          userId: user2?.id,
          guildId: message.guild.id,
          moderatorId: message.author.id,
          reason,
          timestamp: Date.now(),
        })
        data.save()

        var hmm = new MessageEmbed()
          .setDescription(`**${user2?.tag}** has been **banned** | \`${data._id}\``).setColor(`${client.embedColor.moderationRed}`)
        message.channel.send({ embeds: [hmm] }).then(message.delete())

        let log = new MessageEmbed()
          .setAuthor(`Action: Ban`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
          .setColor(`${client.embedColor.logRed}`)
          .addField('Member Info', `● ${user2}\n> __Tag:__ ${user2?.tag}\n> __ID:__ ${user2?.id}`, true)
          .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
          .addField("● Ban Info", `> Reason: ${reason}\n> Punishment ID: ${data._id}`, false)
          .setTimestamp()

        modlog.send({ embeds: [log] })

      } catch (error) {
        message.reply("Unable to find a user with that ID!")
      }

    } else {



      let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't ban that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
      let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't ban that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
      if (user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [xxpermbot] })
      if (user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [xxpermuser] })

      const data = new warnModel({
        type: "Ban",
        userId: user.user.id,
        guildId: message.guild.id,
        moderatorId: message.author.id,
        reason,
        timestamp: Date.now(),
      })
      data.save()

      var hmm = new MessageEmbed()
        .setDescription(`${user.user} has been **banned** | \`${data._id}\``).setColor(`${client.embedColor.moderationRed}`)
      message.channel.send({ embeds: [hmm] }).then(message.delete())


      var dmyes = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been banned from ${message.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setDescription(`You can appeal this ban by clicking [here](https://forms.gle/dW8RGLA65ycC4vcM7).`)
        .setTimestamp()
        .setFooter(`Server ID: ${message.guild.id}`)
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
      user.send({ embeds: [dmyes] }).catch(e => { return })

      user.ban({
        reason: reason,
      })


      let log = new MessageEmbed()
        .setAuthor(`Action: Ban`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logRed}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
        .addField("● Ban Info", `> Reason: ${reason}\n> Punishment ID: ${data._id}`, false)
        .setTimestamp()

      modlog.send({ embeds: [log] })

    }
  }



}