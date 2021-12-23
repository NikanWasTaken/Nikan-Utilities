const { MessageEmbed, MessageActionRow, MessageButton, Message, Client } = require('discord.js');
const warnModel = require("../../models/Punishments.js");
const ms = require("ms");

module.exports = {
  name: 'ban',
  category: 'moderation',
  description: 'Bans a member from the server',
  usage: `[user] <reason>`,
  cooldown: 2000,
  permissions: ["BAN_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    let reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"
    let user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    if (!args[0]) return message.reply({ embeds: [wrongUsage] })

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
          systemExpire: Date.now() + ms("26 weeks")
        })
        data.save()

        var hmm = new MessageEmbed()
          .setDescription(`**${user2?.tag}** has been **banned** | \`${data._id}\``).setColor(`${client.color.moderationRed}`)
        let msg = await message.channel.send({ embeds: [hmm] }).then(message.delete())

        client.log.action({
          type: "Ban",
          color: "BAN",
          user: `${user.id}`,
          moderator: `${message.author.id}`,
          reason: `${reason}`,
          id: `${data._id}`,
          url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
        })

      } catch (error) {

        const embed = new MessageEmbed()
          .setDescription(`This user doesn't exist!`)
          .setColor("RED")
        message.reply({ embeds: [embed] }).then((msg) => {
          client.delete.message(message, msg);
        })

      }

    } else {

      if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
        user.roles.highest.position >= message.member.roles.highest.position ||
        user.user.id === client.config.owner ||
        user.user.bot)
        return message.reply({ embeds: [client.embeds.cannotPerform] })
          .then((msg) => client.delete.message(message, msg))

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
        .setDescription(`${user.user} has been **banned** | \`${data._id}\``)
        .setColor(`${client.color.moderationRed}`)

      let msg = await message.channel.send({ embeds: [hmm] })
        .then(message.delete())

      const row2 = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Appeal")
          .setStyle("LINK")
          .setURL(`https://forms.gle/dW8RGLA65ycC4vcM7`)
      )

      var dmyes = new MessageEmbed()
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been banned from ${message.guild.name}`)
        .setColor(`${client.color.modDm}`)
        .setTimestamp()
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
      user.send({ embeds: [dmyes], components: [row2] })
        .catch(e => { return })

      await user.ban({
        reason: reason,
      })

      client.log.action({
        type: "Ban",
        color: "BAN",
        user: `${user.user.id}`,
        moderator: `${message.author.id}`,
        reason: `${reason}`,
        id: `${data._id}`,
        url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
      })

    }
  }

}