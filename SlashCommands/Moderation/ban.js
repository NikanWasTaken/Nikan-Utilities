const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const ms = require("ms")



module.exports = {
  name: "ban",
  description: `Actions on a ban!`,
  permissions: ["BAN_MEMBERS"],
  cooldown: 3000,
  options: [
    {
      name: "add",
      description: "Bans a member from the server!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to ban!",
          required: false,
          type: "USER",
        },
        {
          name: "user-id",
          description: "The user ID you want to ban! *Fill this if the user is not in this server!*",
          required: false,
          type: "STRING"
        },
        {
          name: "reason",
          description: "The reason of this ban!",
          required: false,
          type: "STRING",
        }
      ]

    },
    {
      name: "remove",
      description: "Unbans a member from the server!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user-id",
          description: "The user you want to unban!",
          required: true,
          type: "STRING",
        },
        {
          name: "reason",
          description: "The reason of the unban",
          required: false,
          type: "STRING",
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
  run: async (client, interaction, args) => {

    const subs = interaction.options.getSubcommand(["add", "remove", 'list'])

    if (subs == "add") {

      let user = interaction.options.getMember("user")
      var reason = interaction.options.getString("reason") || "No reason provided"

      if (!user) {

        try {

          const userstring = interaction.options.getString("user-id")
          const user2 = await interaction.guild.members.ban(`${userstring}`, { reason: reason })

          const data = new warnModel({
            type: "Ban",
            userId: user2?.id,
            guildId: interaction.guildId,
            moderatorId: interaction.user.id,
            reason,
            timestamp: Date.now(),
            systemExpire: Date.now() + ms("26 weeks")
          })
          data.save()

          var hmm = new MessageEmbed()
            .setDescription(`**${user2?.tag}** has been **banned** | \`${data._id}\``)
            .setColor(`${client.color.moderationRed}`)
          await interaction.deleteReply()
          let msg = await interaction.channel.send({ embeds: [hmm] })

          client.log.action({
            type: "Ban",
            color: "BAN",
            user: `${user.user.id}`,
            moderator: `${interaction.user.id}`,
            reason: `${reason}`,
            id: `${data._id}`,
            url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
          })

        } catch (error) {

          const embed = new MessageEmbed()
            .setDescription(`This user doesn't exist!`)
            .setColor(`${client.color.moderationRed}`)
          interaction.followUp({ embeds: [embed] })
            .then(() => {
              client.delete.interaction(interaction);
            })

        }

      } else if (user) {

        if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
          user.roles.highest.position >= interaction.member.roles.highest.position ||
          user.user.id === client.config.owner ||
          user.user.bot
        ) return interaction.followUp({ embeds: [cannotPerform] })

        const data = new warnModel({
          type: "Ban",
          userId: user.user.id,
          guildId: interaction.guildId,
          moderatorId: interaction.user.id,
          reason,
          timestamp: Date.now(),
          systemExpire: Date.now() + ms("26 weeks")
        })
        data.save()

        var hmm = new MessageEmbed()
          .setDescription(`${user.user} has been **banned** | \`${data._id}\``).setColor(`${client.color.moderationRed}`)
        await interaction.deleteReply()
        let msg = await interaction.channel.send({ embeds: [hmm] })

        const row1 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Appeal")
            .setStyle("LINK")
            .setURL(`${client.server.appeal}`)
        )

        var dmyes = new MessageEmbed()
          .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
          .setTitle(`You've been banned from ${interaction.guild.name}`)
          .setColor(`${client.color.modDm}`)
          .setTimestamp()
          .addField("Punishment ID", `${data._id}`, true)
          .addField("Reason", reason, false)
        user.send({ embeds: [dmyes], components: [row1] }).catch(() => { })

        user.ban({
          reason: reason,
        })

        client.log.action({
          type: "Ban",
          color: "BAN",
          user: `${user.user.id}`,
          moderator: `${interaction.user.id}`,
          reason: `${reason}`,
          id: `${data._id}`,
          url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
        })

      } else if (!user && !interaction.options.getString("user-id")) {

        const embed = new MessageEmbed().setDescription("You need to provide a user or a user ID!")
          .setColor("RED")
        interaction.followUp({ embeds: [embed] })
          .then(() => {
            client.delete.interaction(interaction)
          })
      }

    } else if (subs == "remove") {

      let userID = interaction.options.getString("user-id")
      let reason = interaction.options.getString("reason") || "No reason provided"

      interaction.guild.bans.fetch().then((bans) => {
        let BannedUser = bans.find(b => b.user.id == userID)

        const noMemberFound = new MessageEmbed()
          .setDescription(`This user is not banned from the server!`)
          .setColor(`RED`)
        if (!BannedUser) return interaction.followUp({ embeds: [noMemberFound] })
          .then(() => {
            client.delete.interaction(interaction);
          });

        interaction.guild.members.unban(BannedUser.user)

        const data = new warnModel({
          type: "Unban",
          userId: userID,
          guildId: interaction.guildId,
          moderatorId: interaction.user.id,
          reason,
          timestamp: Date.now(),
          systemExpire: Date.now() + ms("26 weeks")
        })
        data.save()

        var pop = new MessageEmbed()
          .setDescription(`**${BannedUser.user.tag}** has been **unbanned** | \`${data._id}\``)
          .setColor(`${client.color.moderation}`)
        await interaction.deleteReply()
        let msg = await interaction.channel.send({ embeds: [pop] })


        client.log.action({
          type: "Unban",
          color: "UNBAN",
          user: `${user.user.id}`,
          moderator: `${interaction.user.id}`,
          reason: `${reason}`,
          id: `${data._id}`,
          url: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${msg.id}`
        })

      })
    }
  }
}