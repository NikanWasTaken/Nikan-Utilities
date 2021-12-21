const { Client, CommandInteraction, MessageEmbed, ReactionUserManager } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const ms = require("ms")



module.exports = {
  name: "kick",
  description: `Kicks a member from the server!`,
  permissions: ["KICK_MEMBERS"],
  cooldown: 5000,
  options: [
    {
      name: "user",
      description: "The user you want to kick!",
      required: true,
      type: "USER",

    },
    {
      name: "reason",
      description: "The reason of the kick!",
      required: false,
      type: "STRING",

    }
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {

    const cannotPerform = new MessageEmbed()
      .setDescription(`You don't have permissions to perform that action!`)
      .setColor("RED")

    var user = interaction.options.getMember("user")

    var reason = interaction.options.getString("reason") || "No reason provided"

    if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
      user.roles.highest.position >= interaction.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot
    )
      return interaction.followUp({ embeds: [cannotPerform] }).then((msg) => {
        setTimeout(() => {
          interaction.deleteReply()
        }, 5000)
      })


    const data = new warnModel({
      type: "Kick",
      userId: user.user.id,
      guildId: interaction.guildId,
      moderatorId: interaction.user.id,
      reason,
      timestamp: Date.now(),
      systemExpire: Date.now() + ms("26 weeks")
    })

    data.save();

    var hmm = new MessageEmbed()
      .setDescription(`${user.user} has been **kicked** | \`${data._id}\``).setColor(`${client.color.moderation}`)
    await interaction.deleteReply()
    let msg = await interaction.channel.send({ embeds: [hmm] })


    var dmyes = new MessageEmbed()
      .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been kicked from ${interaction.guild.name}`)
      .setColor(`${client.color.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Reason", reason, false)
    user.send({ embeds: [dmyes] }).catch(e => { return })

    user.kick({
      reason: reason,
    })


    const log = new MessageEmbed()
      .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
      .setTitle(`➜ Kick`).setURL(`${client.server.invite}`)
      .setColor(`${client.color.logs}`)
      .addField("➜ User", `• ${user.user}\n• ${user.user.tag}\n• ${user.user.id}`, true)
      .addField("➜ Moderator", `• ${interaction.user}\n• ${interaction.user.tag}\n• ${interaction.user.id}`, true)
      .addField("➜ Reason", `${reason}`, false)
      .setFooter(`ID: ${data._id}`)

    const row2 = new MessageActionRow().addComponents(

      new MessageButton()
        .setLabel("Jump to the action")
        .setStyle("LINK")
        .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

    )

    client.webhook.moderation.send({ embeds: [log], components: [row2] })



  }
}