const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const randomnick = require("randomstring")


module.exports = {
  name: "nickname",
  description: 'Manages the nickname of an user in some ways!',
  userPermissions: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "edit",
      description: "Edits the nickname of a member!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to change their nickname!",
          type: "USER",
          required: true
        },
        {
          name: "nickname",
          description: "The nickname you want to change thir nickname to!",
          type: "STRING",
          required: true
        }
      ]

    },
    {
      name: "reset",
      description: "Resets the nickname for a member!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to reset thir nickname!",
          type: "USER",
          required: true
        }
      ]

    },
    {
      name: "moderate",
      description: "Moderates the nickname for an user!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to moderated thir nickname!",
          type: "USER",
          required: true
        }
      ]

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args, modlog) => {

    const subs = interaction.options.getSubcommand(["edit", "reset", "moderate"])
    const user = interaction.options.getUser("user")


    switch (subs) {

      case "reset":

        const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")
        if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
          user.roles.highest.position >= interaction.member.roles.highest.position ||
          user.user.id === client.config.owner ||
          user.user.bot)
          return interaction.followUp({ embeds: [failed] }).then((msg) => {
            setTimeout(() => {
              interaction.deleteReply()
            }, 5000)
          })

        const failedtochange1 = new MessageEmbed().setDescription("This user doesn't have a nickname!").setColor("RED")
        if (user.displayName === user.user.username)
          return interaction.channel.send({ embeds: [failedtochange1] }).then((msg) => {
            setTimeout(() => {
              interaction.deleteReply()
            }, 5000)
          })

        const embed1 = new MessageEmbed()
          .setDescription(`${user.user} nickname has been reset`)
          .setColor(`${client.embedColor.moderation}`)

        interaction.followUp({ embeds: [embed1] })
        user.setNickname(`${user.user.username}`)

        break;
      case "moderate":

        const failed1 = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")
        if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
          user.roles.highest.position >= interaction.member.roles.highest.position ||
          user.user.id === client.config.owner ||
          user.user.bot)
          return interaction.followUp({ embeds: [failed1] }).then((msg) => {
            setTimeout(() => {
              interaction.deleteReply()
            }, 5000)
          })

        const nicknamegen = randomnick.generate({
          length: 6,
          charset: "alphanumeric"
        });
        const nickname1 = `Moderated Nickname ${nicknamegen}`

        const embed2 = new MessageEmbed()
          .setDescription(`${user.user} nickname has been moderated!`)
          .setColor(`${client.embedColor.moderation}`)

        interaction.followUp({ embeds: [embed2] })

        user.setNickname(`${nickname1}`)

        break;
      case "edit":

        const failed2 = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")
        if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
          user.roles.highest.position >= interaction.member.roles.highest.position ||
          user.user.id === client.config.owner ||
          user.user.bot)
          return interaction.followUp({ embeds: [failed2] }).then((msg) => {
            setTimeout(() => {
              interaction.deleteReply()
            }, 5000)
          })

        const name = interaction.options.getString("nickname")
        const failedtochange2 = new MessageEmbed().setDescription("You provided this user's current nickname!").setColor("RED")
        if (user.displayName === name)
          return message.channel.send({ embeds: [failedtochange2] }).then((msg) => {
            setTimeout(() => {
              message?.delete()
              msg?.delete()
            }, 5000)
          })

        const embed4 = new MessageEmbed()
          .setDescription(`${user.user} nickname has been changed to \`${name}\``)
          .setColor(`${client.embedColor.moderation}`)

        interaction.followUp({ embeds: [embed4] })
        user.setNickname(`${name}`)

        break;
    }



  }
}