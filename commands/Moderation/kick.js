const { MessageEmbed, WebhookClient, MessageActionRow, MessageButton } = require('discord.js')
const warnModel = require("../../models/Punishments.js")
const ms = require("ms")

module.exports = {
  name: 'kick',
  category: 'moderation',
  description: 'Kicks a user from the server.',
  usage: `[user] <reason>`,
  cooldown: 3000,
  userPermissions: ["KICK_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed, modlog) => {

    var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

    if (!args[0]) return message.reply({ embeds: [missingpartembed] })
    var reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"

    let erm = new MessageEmbed().setDescription(`This user is not in this guild!`).setColor(`RED`)
    if (!user) return message.reply({ embeds: [erm] }).then((msg) => {
      setTimeout(() => {
        msg?.delete()
        message?.delete()
      }, 5000)
    })

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
      type: "Kick",
      userId: user.user.id,
      guildId: message.guild.id,
      moderatorId: message.author.id,
      reason,
      timestamp: Date.now(),
      expires: Date.now() + ms('4 weeks')
    })

    data.save();

    var hmm = new MessageEmbed()
      .setDescription(`${user.user} has been **kicked** | \`${data._id}\``).setColor(`${client.embedColor.moderation}`)
    let msg = await message.channel.send({ embeds: [hmm] }).then(message.delete())

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Join back")
        .setStyle("LINK")
        .setURL(`${client.server.invite}`)
    )

    var dmyes = new MessageEmbed()
      .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been kicked from ${message.guild.name}`)
      .setColor(`${client.embedColor.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Reason", reason, false)

    user.send({ embeds: [dmyes], components: [row] }).catch(e => { return })


    user.kick({
      reason: reason,
    })

    let log = new MessageEmbed()
      .setAuthor(`Moderation • Kick`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`** **`)
      .setColor(`${client.embedColor.logs}`)
      .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
      .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
      .addField("Punishment ID", `\`${data._id}\``)
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