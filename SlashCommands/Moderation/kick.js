const { Client, MessageEmbed } = require("discord.js");
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
  run: async (client, interaction) => {

    var user = interaction.options.getMember("user")
    var reason = interaction.options.getString("reason") || "No reason provided"

    if (
      user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
      user.roles.highest.position >= interaction.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot
    )
      return interaction.followUp({ embeds: [client.util.embed.cannotPerform] })
        .then(() => {
          client.util.delete.interaction(interaction);
        })


    const data = new warnModel({
      type: "Kick",
      userId: user.user.id,
      guildId: interaction.guildId,
      moderatorId: interaction.user.id,
      reason: reason,
      timestamp: Date.now(),
      systemExpire: Date.now() + ms("26 weeks")
    })
    data.save();

    var hmm = new MessageEmbed()
      .setDescription(`${user.user} has been **kicked** | \`${data._id}\``)
      .setColor(`${client.color.moderation}`)
    await interaction.deleteReply()
    let msg = await interaction.channel.send({ embeds: [hmm] })


    var dmyes = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
      .setTitle(`You've been kicked from ${interaction.guild.name}`)
      .setColor(`${client.color.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Reason", reason, false)
    user.send({ embeds: [dmyes] }).catch(() => { return })

    user.kick({
      reason: reason,
    })

    client.log.action({
      type: "Kick",
      color: "KICK",
      user: `${user.user.id}`,
      moderator: `${interaction.user.id}`,
      reason: `${reason}`,
      id: `${data._id}`,
      url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
    })
  }
}