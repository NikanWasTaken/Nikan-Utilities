const { Client, CommandInteraction, MessageEmbed } = require("discord.js");



module.exports = {
  name: "membercount",
  description: `Counts server members!`,
  cooldown: 5000,
  botCommand: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {


    var bb = new MessageEmbed()
      .setAuthor({ name: "Member Count", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`There are **${interaction.guild.members.cache.size}** members in this server`)
      .setColor("#a8bd91")
      .addFields({
        name: "Humans",
        value: `‌‌‌‌${interaction.guild.members.cache.filter(member => !member.user.bot).size}`,
        inline: true
      }, {
        name: "Bots",
        value: `‌‌‌‌${interaction.guild.members.cache.filter(member => member.user.bot).size}`,
        inline: true
      }, {
        name: "Online Members",
        value: `${interaction.guild.members.cache.filter(m => m.presence !== null).size}`,
        inline: true,
      }, {
        name: "Advanced Counts",
        value: [
          `<:NUonline:886215547249913856> • Online: ${message.guild.members.cache.filter(m => m?.presence?.status === "online").size}`,
          `<:NUidle:906867112612601866> • Idle: ${message.guild.members.cache.filter(m => m?.presence?.status === "idle").size}`,
          `<:NUdnd:906867112222531614> • Do not disturb: ${message.guild.members.cache.filter(m => m?.presence?.status === "dnd").size}`,
          `<: NUoffline: 906867114126770186 > • Offline / Invisible: ${message.guild.members.cache.filter((m) => !statuses?.includes(m.presence?.status)).size}`
        ].join("\n"),
        inline: false,
      })

    interaction.followUp({ embeds: [bb] })



  }
}