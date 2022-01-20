const { Client, MessageEmbed, CommandInteraction } = require("discord.js");


module.exports = {
  name: "lockdown",
  description: `Takes an action on every channel!`,
  permissions: ["BAN_MEMBERS"],
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
  run: async (client, interaction) => {

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
      interaction.guild.channels.cache.get(`${client.server.verificationChannel}`)
        .permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: null })

      var hii = new MessageEmbed()
        .setAuthor({ name: "Server Locked", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription("This server is currently on lockdown, please don't dm any staff members about this. more information will be sent here.\n__**You are not muted**__")
        .setColor(`${client.color.moderation}`)
        .setTimestamp()
        .addFields({
          name: "Reason",
          value: reason
        })

      await interaction.guild.channels.cache.get(`${client.server.generalChannel}`).send({ embeds: [hii] })

      await msg.edit({ content: "Server Locked!" })


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
        .setAuthor({ name: "Server Unlocked", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription("This server has been unlocked by a staff member.")
        .setColor(`${client.color.moderation}`)
        .addField("Reason", `${reason}`)
        .setTimestamp()

      await interaction.guild.channels.cache.get(`${client.server.generalChannel}`).send({ embeds: [hii] })

      await msg.edit({ content: "Server unlocked!" })

    }
  }
}