const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js");
const ms = require("ms")


module.exports = {
  name: 'warn',
  category: 'moderation',
  description: `Warns a user in the server`,
  usage: '[user] [reason]',
  cooldown: 3000,
  permissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, wrongUsage) => {

    const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    const reason = args.slice(1).join(" ")

    if (!args[0] || !reason) return wrongUsage(message)

    if (!user) {
      const embed = new MessageEmbed()
        .setDescription(`This user is not in this guild!`)
        .setColor("RED")
      message.reply({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg)
      })
    }

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot
    )
      return message.reply({ embeds: [client.embeds.cannotPerform] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
      })

    if (client.warncooldown.has(`${user.user.id}`)) {
      const embed = new MessageEmbed()
        .setDescription("Whoops, looks like there is a double warning here!")
        .setColor("RED")

      return message.channel.send({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg)
      })

    }

    const data = new warnModel({
      type: "Warn",
      userId: user.user.id,
      guildId: message.guild.id,
      moderatorId: message.author.id,
      reason,
      timestamp: Date.now(),
      expires: Date.now() + ms('4 weeks'),
      systemExpire: Date.now() + ms("4 weeks")
    })
    data.save();


    let warndm = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setTitle(`You've been Warned in ${message.guild.name}`)
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Expires In", `4 weeks`, true)
      .addField("Reason", reason, false)
      .setColor(`${client.color.modDm}`)
      .setTimestamp()
    user.send({ embeds: [warndm] }).catch(() => { })

    let warne = new MessageEmbed()
      .setDescription(`${user} has been **warned** | \`${data._id}\``)
      .setColor(`${client.color.moderation}`)

    let msg = await message.channel.send({ embeds: [warne] }).then(message.delete())

    client.warncooldown.set(
      `${user.user.id}`,
    );
    setTimeout(() => {
      client.warncooldown.delete(`${user.user.id}`);
    }, 10000);

    client.log.action({
      type: "Warn",
      color: "WARN",
      user: `${user.user.id}`,
      moderator: `${message.author.id}`,
      reason: `${reason}`,
      id: `${data._id}`,
      url: `https://discord.com/channels/${message.guildId}/${message.channelId}/${msg.id}`
    })

    // ---- checks for warns and mutes

    const userWarnings = await warnModel.find({
      userId: user.user.id,
      guildId: message.guild.id,
      type: "Warn",
    });

    const numberofwarns = [];
    userWarnings.map((i) => {
      numberofwarns.push(`${i + 1}`)
    })


    if (numberofwarns.length == 2) {

      await user.mute({
        duration: "2h",
        msg: message,
        reason: reason,
        auto: true
      })

    } else if (numberofwarns.length == 4) {

      await user.mute({
        duration: "6h",
        msg: message,
        reason: reason,
        auto: true
      })

    } else if (numberofwarns.length == 6) {

      const data2 = new warnModel({
        type: "Ban",
        userId: user.user.id,
        guildId: message.guild.id,
        moderatorId: `${client.user.id}`,
        reason: "Reaching 6 Strikes",
        timestamp: Date.now(),
        systemExpire: Date.now() + ms("26 weeks"),
      })
      data2.save()

      const row2 = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Appeal")
          .setStyle("LINK")
          .setURL(`${client.server.appeal}`)
      )

      let warndm = new MessageEmbed()
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setTitle(`You've been Banned from ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Reason", "Reaching 6 strikes", false)
        .setColor(`${client.color.modDm}`)
        .setTimestamp()
      user.send({ embeds: [warndm], components: [row2] }).catch(() => { })

      user.ban({
        reason: "Reaching 6 stikes!"
      })

      client.log.autoAction({
        type: "Ban",
        color: "BAN",
        user: `${user.user.id}`,
        reason: `Reaching 6 normal warnings`
      });

    }
  },
};