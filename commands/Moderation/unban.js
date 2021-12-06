const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const warnModel = require("../../models/Punishments.js")

module.exports = {
  name: 'unban',
  category: 'moderation',
  description: 'Unbans a banned member from the server',
  usage: '[user ID] <reason>',
  aliases: ['deban'],
  cooldown: 5000,
  userPermissions: ["MOVE_MEMBERS"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed) => {


    if (!args[0]) return message.reply({ embeds: [missingpartembed] })
    let userID = args[0]
    let reason = message.content.split(" ").slice(2).join(" ") || "No reason provided"

    message.guild.bans.fetch().then(async bans => {

      let BannedUser = bans.find(b => b.user.id == userID)

      const nomemberfound = new MessageEmbed().setDescription(`This user is not banned from the server!`).setColor(`RED`)

      if (!BannedUser) return
      interaction.followUp({ embeds: [nomemberfound] }).then(async (msg) => {
        setTimeout(() => {
          interaction.deleteReply()
        }, 5000)
      })

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
        .setDescription(`**${BannedUser.user.tag}** has been **unbanned** | \`${data._id}\``)
        .setColor(`${client.embedColor.moderation}`)
      let msg = await message.channel.send({ embeds: [pop] }).then(message.delete())

      let log = new MessageEmbed()
        .setAuthor(`Moderation • Unban`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField('👥 User', `Mention • ${BannedUser.user}\nTag • ${BannedUser.user.tag}\nID • ${BannedUser.user.id}`, true)
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

      client.webhook.moderation.send({ embeds: [log], components: [row] })

    })

  }

}

