const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
let mod = false;

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
  run: async (client, interaction) => {

    const statuses = ["dnd", "online", "idle"]

    const components = (style) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Advanced Counts")
          .setCustomId("membercount")
          .setStyle(`${style}` || "SECONDARY")
      )
    ]

    var embed = new MessageEmbed()
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
        value: `${interaction.guild.members.cache.filter((m) => statuses?.includes(m.presence?.status)).size}`,
        inline: true,
      })
      .setFooter({ text: 'Advanced Counts: Off' })

    const msg = await interaction.followUp({
      embeds: [embed],
      components: components("SECONDARY")
    })


    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 30000,
    });

    collector.on("collect", (collected) => {

      if (collected.customId === "membercount") {

        if (collected.user?.id !== interaction.user.id) return collected.reply({
          content: "This menu isn't for you!",
          ephemeral: true
        })

        switch (mod) {
          case false:

            var embedTrue = new MessageEmbed()
              .setAuthor({ name: "Member Count", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`There are **${interaction.guild.members.cache.size}** members in this server`)
              .setColor("GREEN")
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
                value: `${interaction.guild.members.cache.filter((m) => statuses?.includes(m.presence?.status)).size}`,
                inline: true,
              }, {
                name: "Advanced Counts",
                value: [
                  `<:NUonline:886215547249913856> • Online: ${interaction.guild.members.cache.filter(m => m?.presence?.status === "online").size}`,
                  `<:NUidle:906867112612601866> • Idle: ${interaction.guild.members.cache.filter(m => m?.presence?.status === "idle").size}`,
                  `<:NUdnd:906867112222531614> • Do not disturb: ${interaction.guild.members.cache.filter(m => m?.presence?.status === "dnd").size}`,
                  `<:NUoffline:906867114126770186> • Offline / Invisible: ${interaction.guild.members.cache.filter((m) => !statuses?.includes(m.presence?.status)).size}`
                ].join("\n"),
                inline: false,
              })
              .setFooter({ text: 'Advanced Counts: On' })

            msg.edit({
              embeds: [embedTrue],
              components: components("SUCCESS")
            })
            collected.deferUpdate()
            mod = true;
            break;

          case true:

            msg.edit({
              embeds: [embed],
              components: components("SECONDARY")
            })
            collected.deferUpdate()
            mod = false;
            break;
        }
      }
    })

    collector.on("end", () => {
      msg.edit({ components: [] })
    })
  }
}