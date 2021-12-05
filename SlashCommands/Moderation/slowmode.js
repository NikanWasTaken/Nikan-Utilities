const { Client, CommandInteraction, Me, MessageEmbed } = require("discord.js");
const ms = require("ms")


module.exports = {
  name: "slowmode",
  description: 'Sets the slowmode for the channel.',
  userPermissions: ["MANAGE_MESSAGES"],
  cooldown: 5000,
  options: [
    {
      name: "rate",
      description: "The rate of the slowmode in seconds.",
      required: true,
      type: 'INTEGER',

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args, modlog) => {


    const rate = interaction.options.getInteger("rate")
    if (!rate) {

      interaction.followUp(interaction.channel.rateLimitPerUser == 0 ? "There is no slowmode on this channel" : `The current slowmode is on **${limit}** seconds.**.`)

    } else {
      var limit = parseInt(rate)
      if (limit > 21601) return interaction.followUp("You can't set the slowmode to more than 6 hours!").then((msg) => {
        setTimeout(() => {
          interaction.deleteReply()
        }, 5000)
      })

      if (limit == interaction.channel.rateLimitPerUser) return interaction.followUp(`The current slowmode is \`${interaction.channel.rateLimitPerUser}\` second, Nothing changed.`).then(() => interaction.channel.setRateLimitPerUser(limit))

      if (limit < 1) return interaction.followUp("Slowmode has been turned off, go crazy!").then(() => interaction.channel.setRateLimitPerUser("0"))
      interactionf.followUp(`${limit < 1 ? "Slowmode has been turned off, go crazy!" : `Slowmode has been set to ` + limit + ' seconds.'}`).then(() => interaction.channel.setRateLimitPerUser(limit))
      interaction.channel.setRateLimitPerUser(limit);


    }



  }
}