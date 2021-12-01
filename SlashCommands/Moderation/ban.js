const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
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
          required: true,
          type: "USER",
        },
        {
          name: "reason",
          description: "The reason of this ban!",
          required: true,
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
    {
      name: "list",
      description: "Lists all the banned members in the guild!",
      type: "SUB_COMMAND",
    }
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

      let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't ban that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
      let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't ban that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
      if (user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot] })
      if (user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })


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
      interaction.followUp({ embeds: [hmm] })

      var dmyes = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been banned from ${interaction.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setDescription(`You can appeal this ban by clicking [here](https://forms.gle/dW8RGLA65ycC4vcM7).`)
        .setTimestamp()
        .setFooter(`Server ID: ${interaction.guild.id}`)
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
      user.send({ embeds: [dmyes] }).catch(e => { return })

      user.ban({
        reason: reason,
      })

      let log = new MessageEmbed()
        .setAuthor(`Action: Ban`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
        .setColor(`${client.embedColor.logRed}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
        .addField("● Ban Info", `> Reason: ${reason}\n> Punishment ID: ${data._id}`, false)
        .setTimestamp()

      modlog.send({ embeds: [log] })

    } else if (subs == "remove") {

      let userID = interaction.options.getString("user-id")
      let reason = interaction.options.getString("reason") || "No reason provided"

      interaction.guild.bans.fetch().then(bans => {
        let BannedUser = bans.find(b => b.user.id == userID)

        if (!BannedUser) return interaction.followUp("Couldn't find that user in server's banned members!")
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
        interaction.followUp({ embeds: [pop] })



        let log = new MessageEmbed()
          .setAuthor(`Action: Unban`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor("#BFFF00")
          .addField('Unbanned Member Info', `● ${BannedUser.user}\n> __Tag:__ ${BannedUser.user.tag}\n> __ID:__ ${BannedUser.user.id}`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .setTimestamp()
        modlog.send({ embeds: [log] })

      })

    } else if (subs == "list") {

      try {


        var amount = 1;
        const fetchBans = interaction.guild.bans.fetch()
        const bannedMembers = (await fetchBans)
          .map((member) => `> ${amount++}. **${member.user.tag}** | \`${member.user.id}\``)
          .join("\n");
        const bansEmbed = new MessageEmbed()
          .setAuthor(`Banned Members in ${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`${bannedMembers}`)
          .setFooter(`Amount: ${amount - 1}`)
          .setTimestamp()
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setColor("RED")


        interaction.followUp({ embeds: [bansEmbed] })

      } catch (error) {
        interaction.followUp("Something went wrong!")
      }

    }


  }
}