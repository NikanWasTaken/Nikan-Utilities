const { Client, CommandInteraction } = require("discord.js");

module.exports = {
  name: "slowmode",
  description: 'Sets the slowmode for the channel.',
  permissions: ["MANAGE_MESSAGES"],
  cooldown: 5000,
  options: [
    {
      name: "rate",
      description: "The rate of the slowmode in seconds.",
      required: false,
      type: 'INTEGER',

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {


    const rate = interaction.options.getInteger("rate")

    if (!rate && rate !== 0) {

      switch (interaction.channel.rateLimitPerUser) {

        case 0:
          interaction.followUp({
            content: "There is no slowmode on this channel!"
          })
          break

        default:
          interaction.followUp({
            content: `There is currently a **${interaction.channel.rateLimitPerUser} second** slowmode!`
          })
          break;
      }

    } else {


      let limit = rate;

      if (limit > 21601) {
        return interaction.followUp("You can't set the slowmode to more than 6 hours!")
          .then(() => {
            client.util.delete.interaction(interaction)
          })
      }

      if (limit == interaction.channel.rateLimitPerUser) {
        return interaction.followUp({
          content: `The current slowmode is **${interaction.channel.rateLimitPerUser} second**, nothing changed!`
        })
      }

      if (limit == 0) {
        return interaction.followUp({ content: "Slowmode has been turned off, woo hoo!" })
          .then(() => {
            interaction.channel.setRateLimitPerUser("0")
          })
      }

      interaction.followUp(
        limit == 1 ?
          { content: `Slowmode has been changed to **${limit} second**!` } :
          { content: `Slowmode has been changed to **${limit} seconds**!` }
      )
        .then(() => {
          interaction.channel.setRateLimitPerUser(limit)
        })

    }
  }
}