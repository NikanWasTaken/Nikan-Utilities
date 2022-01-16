const { Client, CommandInteraction } = require("discord.js");


module.exports = {
  name: "afk",
  description: 'Set a custom afk for your self.',
  ephemeral: true,
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
  run: async (client, interaction) => {

    let reason = interaction.options.getString("reason") || "AFK"

    client.afk.set(interaction.member.user.id, [Date.now(), reason])

    interaction.followUp({ content: `You are now AFK: ${reason}` })
    interaction.member.setNickname(`[AFK] ${interaction.member.displayName}`)
      .catch(() => { })

  }
}