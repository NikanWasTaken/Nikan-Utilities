const { Client, CommandInteraction, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");



module.exports = {
  name: "lockdown",
  description: `Takes an action on every channel!`,
  userPermissions: ["BAN_MEMBERS"],
  cooldown: 5000,
  options: [
    {
      name: "action",
      description: "The action you want to take!",
      required: true,
      type: "STRING",
      choices: [
        {
          name: "start",
          value: "start",
          description: "Starts the lockdown and locks all the channels in the guild!"
        },
        {
          name: "end",
          value: "end",
          description: "Ends the lockdown and inlocks all the channels in the guild!"
        }
      ]


    },
    {
      name: "reason",
      description: "The reason of your lockdown!",
      required: true,
      type: "STRING",
    }
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {

    const action = interaction.options.getString("action")
    var reason = interaction.options.getString("reason")

    if (action == "start") {

      let msg = await interaction.followUp({ content: "Locking the server..." })

      interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").forEach(ch => {
        ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: false
        })
      })

      interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").forEach(ch => {
        ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: false
        })
      })

      var hii = new MessageEmbed()
        .setAuthor("Server Locked", client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("This server has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
        .setColor(`${client.embedColor.moderation}`)
        .setTimestamp()
        .addFields({
          name: "Reason",
          value: reason
        })

      let msg2 = interaction.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      await msg.edit({ content: "Server Locked!" })


      let log = new MessageEmbed()
        .setAuthor(`Moderation • Lockdown`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      const rowlog = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Jump to the action")
          .setStyle("LINK")
          .setURL(`https://discord.com/channels/${msg2.guild.id}/${msg2.channel.id}/${msg2.id}`)

      )

      client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

    } else if (action == "end") {

      let msg = await interaction.followUp({ content: "Unlocking the server..." })

      interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").forEach(ch => {
        ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SEND_MESSAGES: null
        })
      })

      interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").forEach(ch => {
        ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          CONNECT: null
        })
      })

      var hii = new MessageEmbed()
        .setAuthor("Server Unlocked", client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("This server has been unlocked by a staff member.\nYou may start chatting now!")
        .setColor(`${client.embedColor.moderation}`)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      let msg2 = interaction.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

      await msg.edit({ content: "Server unlocked!" })

      let log = new MessageEmbed()
        .setAuthor(`Moderation • Lockdown End`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`** **`)
        .setColor(`${client.embedColor.logs}`)
        .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${interaction.user}\nTag • ${interaction.user.tag}\nID • ${interaction.user.id}`, true)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      const rowlog = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Jump to the action")
          .setStyle("LINK")
          .setURL(`https://discord.com/channels/${msg2.guild.id}/${msg2.channel.id}/${msg2.id}`)

      )

      client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

    }

  }
}