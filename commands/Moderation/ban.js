const { MessageEmbed, WebhookClient, MessageActionRow, MessageButton } = require('discord.js')
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
        let msg = await message.channel.send({ embeds: [hmm] }).then(message.delete())

        let log = new MessageEmbed()
          .setAuthor(`Moderation • Ban`, message.guild.iconURL({ dynamic: true }))
          .setDescription(`** **`)
          .setColor(`${client.embedColor.logs}`)
          .addField('👥 User', `Mention • ${user2}\nTag • ${user2?.tag}\nID • ${user2?.id}`, true)
          .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
          .addField("Punishment ID", `${data._id}`)
          .addField("Reason", `${reason}`)
          .setTimestamp()

        const row = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Jump to the action")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

        )

        modlog.send({ embeds: [log], components: [row] })

      } catch (error) {

        const embed = new MessageEmbed().setDescription(`This user doesn't exist!`).setColor("RED")
        message.reply({ embeds: [embed] }).then((msg) => {
          setTimeout(() => {
            msg?.delete()
            message?.delete()
          }, 5000)
        })

      }

    } else {



      const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")

      if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
        user.roles.highest.position >= message.member.roles.highest.position ||
        user.user.id === client.config.owner ||
        user.user.bot)
        return message.reply({ embeds: [failed] }).then((msg) => {
          setTimeout(() => {
            msg?.delete()
            message?.delete()
          }, 5000)
        })

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
      let msg = await message.channel.send({ embeds: [hmm] }).then(message.delete())

      const row2 = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Appeal")
          .setStyle("LINK")
          .setURL(`https://forms.gle/dW8RGLA65ycC4vcM7`)

      )

      var dmyes = new MessageEmbed()
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been banned from ${message.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
      user.send({ embeds: [dmyes], components: [row2] }).catch(e => { return })

      await user.ban({
        reason: reason,
      })

      let log = new MessageEmbed()
        .setAuthor(`Moderation • Ban`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
        .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
        .addField("Punishment ID", `${data._id}`)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      const rowlog = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Jump to the action")
          .setStyle("LINK")
          .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

      )

      modlog.send({ embeds: [log], components: [rowlog] })

    }
  }



}