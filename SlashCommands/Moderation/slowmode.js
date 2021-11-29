const { Client, CommandInteraction, Me, MessageEmbed } = require("discord.js");
const ms = require("ms")


module.exports = {
    name: "slowmode",
    description : 'Sets the slowmode for the channel.',
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



          if (!interaction.options.getInteger("rate")) return interaction.followUp(interaction.channel.rateLimitPerUser == 0 ? "There is no slowmode on this channel" : `The current slowmode is on **${limit}** seconds.**.`)
          var limit = interaction.options.getInteger("rate")
          if(limit > 21601) return interaction.followUp("You can't set the slowmode to more than 6 hours!")
          if(limit == interaction.channel.rateLimitPerUser) return interaction.followUp(`The current slowmode is \`${interaction.channel.rateLimitPerUser}\` second, Nothing changed.`).then(() => interaction.channel.setRateLimitPerUser(limit))

          let bru = ms(limit * 1000, { long: true})

          let logss = new MessageEmbed()
          .setAuthor(`Action: Slowmode`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logAqua}`)
          .addField('Channel Info', `● ${interaction.channel}\n> __Name:__ ${interaction.channel.name}\n> __ID:__ ${interaction.channel.id}`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .addField("● Slowmode Info", `> Previous Slowmode Rate: **${interaction.channel.rateLimitPerUser == 0 ? "Slowmode off" : ms(interaction.channel.rateLimitPerUser * 1000, { long: true})}**\n> New Slowmode Rate: **${limit == 0 ? "Slowmode off" : bru}**`)
          .setTimestamp()
          modlog.send({ embeds: [logss] })

          if(limit < 1) return interaction.followUp("Slowmode has been turned off, go crazy!").then(() => interaction.channel.setRateLimitPerUser("0"))
          interaction.followUp(`${limit < 1 ? "Slowmode has been turned off, go crazy!" : `Slowmode has been set to ` + limit + ' seconds.'}`).then(() => interaction.channel.setRateLimitPerUser(limit))
          interaction.channel.setRateLimitPerUser(limit);


    }
}