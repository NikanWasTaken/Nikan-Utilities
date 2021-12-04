const { Client, CommandInteraction, MessageEmbed, ReactionUserManager } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const ms = require("ms")



module.exports = {
  name: "kick",
  description: `Kicks a member from the server!`,
  userPermissions: ["KICK_MEMBERS"],
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
  run: async (client, interaction, args, modlog) => {

    var user = interaction.options.getMember("user")

    var reason = interaction.options.getString("reason") || "No reason provided"

    const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")

    if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
      user.roles.highest.position >= interaction.member.roles.highest.position ||
      user.user.id === client.config.owner)
      return interaction.followUp({ embeds: [failed] }).then((msg) => {
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
      expires: Date.now() + ms('4 weeks')
    })

    data.save();

    var hmm = new MessageEmbed()
      .setDescription(`${user.user} has been **kicked** | \`${data._id}\``).setColor(`${client.embedColor.moderation}`)
    await interaction.deleteReply()
    let msg = await interaction.channel.send({ embeds: [hmm] })


    var dmyes = new MessageEmbed()
      .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been kicked from ${interaction.guild.name}`)
      .setColor(`${client.embedColor.modDm}`)
      .setTimestamp()
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Reason", reason, false)
    user.send({ embeds: [dmyes] }).catch(e => { return })

    user.kick({
      reason: reason,
    })


    let log = new MessageEmbed()
      .setAuthor(`Moderation • Kick`, interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`** **`)
      .setColor(`${client.embedColor.logs}`)
      .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
      .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
      .addField("Punishment ID", `${data._id}`)
      .addField("Reason", `${reason}`)
      .setTimestamp()

    const row2 = new MessageActionRow().addComponents(

      new MessageButton()
        .setLabel("Jump to the action")
        .setStyle("LINK")
        .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

    )

    modlog.send({ embeds: [log], components: [row2] })



  }
}