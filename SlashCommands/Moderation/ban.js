const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js")



module.exports = {
  name: "ban",
  description: `Actions on a ban!`,
  userPermissions: ["BAN_MEMBERS"],
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
  run: async (client, interaction, args, modlog) => {

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
          })
          data.save()

          var hmm = new MessageEmbed()
            .setDescription(`**${user2?.tag}** has been **banned** | \`${data._id}\``).setColor(`${client.embedColor.moderationRed}`)
          await interaction.deleteReply()
          let msg = await interaction.channel.send({ embeds: [hmm] })

          let log = new MessageEmbed()
            .setAuthor(`Moderation • Ban`, interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`** **`)
            .setColor(`${client.embedColor.logs}`)
            .addField('👥 User', `Mention • ${user2}\nTag • ${user2?.tag}\nID • ${user2?.id}`, true)
            .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
            .addField("Punishment ID", `${data._id}`)
            .addField("Reason", `${reason}`)
            .setTimestamp()

          const row = new MessageActionRow().addComponents(

            new MessageButton()
              .setLabel("Jump to the action")
              .setStyle("LINK")
              .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

          )

          modlog.send({ embeds: [log], components: [row] })

        } catch (error) {

          const embed = new MessageEmbed().setDescription(`This user doesn't exist!`).setColor(`${client.embedColor.moderationRed}`)
          interaction.followUp({ embeds: [embed] }).then((msg) => {
            setTimeout(() => {
              interaction.deleteReply()
            }, 5000)
          })

        }

      } else if (user) {

        const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")

        if (user.roles.highest.position >= interaction.guild.me.roles.highest.position ||
          user.roles.highest.position >= interaction.member.roles.highest.position ||
          user.user.id === client.config.owner
        ) return interaction.followUp({ embeds: [failed] })


        const data = new warnModel({
          type: "Ban",
          userId: user.user.id,
          guildId: interaction.guildId,
          moderatorId: interaction.user.id,
          reason,
          timestamp: Date.now(),
        })
        data.save()

        var hmm = new MessageEmbed()
          .setDescription(`${user.user} has been **banned** | \`${data._id}\``).setColor(`${client.embedColor.moderationRed}`)
        await interaction.deleteReply()
        let msg = await interaction.channel.send({ embeds: [hmm] })

        const row1 = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Appeal")
            .setStyle("LINK")
            .setURL(`https://forms.gle/dW8RGLA65ycC4vcM7`)

        )

        var dmyes = new MessageEmbed()
          .setAuthor(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`You've been banned from ${interaction.guild.name}`)
          .setColor(`${client.embedColor.modDm}`)
          .setTimestamp()
          .addField("Punishment ID", `${data._id}`, true)
          .addField("Reason", reason, false)
        user.send({ embeds: [dmyes], components: [row1] }).catch(e => { return })

        user.ban({
          reason: reason,
        })

        let log = new MessageEmbed()
          .setAuthor(`Moderation • Ban`, interaction.guild.iconURL({ dynamic: true }))
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

      } else if (!user && !interaction.options.getString("user-id")) {

        const embed = new MessageEmbed().setDescription("You need to provide a user or a user ID!").setColor("RED")

        interaction.followUp({ embeds: [embed] }).then((msg) => {
          setTimeout(() => {
            interaction.deleteReply()
          }, 5000)
        })

      }

    } else if (subs == "remove") {

      let userID = interaction.options.getString("user-id")
      let reason = interaction.options.getString("reason") || "No reason provided"

      interaction.guild.bans.fetch().then(async (bans) => {
        let BannedUser = bans.find(b => b.user.id == userID)

        const nomemberfound = new MessageEmbed().setDescription(`This user is not banned from the server!`).setColor(`RED`)

        if (!BannedUser) return
        interaction.followUp({ embeds: [nomemberfound] }).then(async (msg) => {
          setTimeout(() => {
            interaction.deleteReply()
          }, 5000)
        })

        interaction.guild.members.unban(BannedUser.user)

        const data = new warnModel({
          type: "Unban",
          userId: userID,
          guildId: interaction.guildId,
          moderatorId: interaction.user.id,
          reason,
          timestamp: Date.now(),
        })
        data.save()

        var pop = new MessageEmbed()
          .setDescription(`**${BannedUser.user.tag}** has been **unbanned** | \`${data._id}\``)
          .setColor(`${client.embedColor.moderation}`)
        await interaction.deleteReply()
        let msg = await interaction.channel.send({ embeds: [pop] })



        let log = new MessageEmbed()
          .setAuthor(`Moderation • Unban`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`** **`)
          .setColor(`${client.embedColor.logs}`)
          .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
          .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
          .addField("Punishment ID", `${data._id}`)
          .addField("Reason", `${reason}`)
          .setTimestamp()

        const row = new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Jump to the action")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

        )

        modlog.send({ embeds: [log], components: [row] })


      })

    }


  }
}