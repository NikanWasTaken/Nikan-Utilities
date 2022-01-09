const { Client, MessageEmbed } = require("discord.js");


module.exports = {
  name: "afk",
  description: 'Set a custom afk for your self.',
  ephemeral: true,
  botCommand: true,
  cooldown: 15000,
  options: [
    {
      name: "reason",
      description: "The reason of your afk!",
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
  run: async ({ client, interaction }) => {

    let reason = interaction.options.getString("reason") || "AFK"

    client.afk.set(interaction.member.user.id, [Date.now(), reason])

    let no = new MessageEmbed()
      .setDescription(`You are now afk for the reason: ${reason}`).
      setColor(`${client.color.botBlue}`)

    interaction.followUp({ embeds: [no] })
    interaction.member.setNickname(`[AFK] ${interaction.member.user.username}`)
      .catch(() => { })

  }
}