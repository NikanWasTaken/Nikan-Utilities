const { Client, CommandInteraction, MessageEmbed } = require("discord.js");


module.exports = {
  name: "purge",
  description: 'Purges messages in the channel',
  cooldown: 10000,
  userPermissions: ["BAN_MEMBERS"],
  options: [
    {
      name: "amount",
      description: "The number of messages you want to purge.",
      required: true,
      type: "INTEGER",

    },
    {
      name: "user",
      description: "The user you want to purge the messages from!",
      required: false,
      type: "USER",

    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args, modlog) => {

    var clear = interaction.options.getInteger("amount")
    var user = interaction.options.getMember("user")


    let heh = new MessageEmbed().setDescription("You need to provide a number between 1 and 100 to purge.").setColor("RED")
    if (!clear || isNaN(clear) || clear > 100 || clear < 1) return interaction.followUp({ embeds: [heh] })


    if (user) {

      const messages = interaction.channel.messages.fetch({ limit: clear })
      const filtered = (await messages).filter(m => m.author.id === user.id)

      await interaction.channel.bulkDelete(filtered)

      let embeda = new MessageEmbed()
        .setDescription(`Cleared \`${clear}\` messages from \`${user.user.tag}\``)
        .setColor(`${client.embedColor.moderation}`)

      let msg = await interaction.channel.send({ embeds: [embeda] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })

      let log = new MessageEmbed()
        .setAuthor(`Action: Purge`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
        .setColor(`${client.embedColor.logAqua}`)
        .addField('Channel Info', `● ${msg.channel}\n> __Name:__ ${msg.channel.name}\n> __ID:__ ${msg.channel.id}`, true)
        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
        .addField("● Purge Info", `> Number of messages: **${clear}**\n> From the user: ${user.user}`)
        .setTimestamp()

      modlog.send({ embeds: [log] })


    } else if (!user) {

      let msgs = message.channel.messages.fetch({ limit: clear })
      message.channel.bulkDelete((await msgs))

      let embeda = new MessageEmbed()
        .setDescription(`Cleared ${clear} messages in ${interaction.channel}`)
        .setColor(`${client.embedColor.moderation}`)

      let msg = await interaction.channel.send({ embeds: [embeda] }).then((msg) => { setTimeout(() => { msg.delete(), message.delete() }, 5000) })

      let log = new MessageEmbed()
        .setAuthor(`Action: Purge`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
        .setColor(`${client.embedColor.logAqua}`)
        .addField('Channel Info', `● ${msg.channel}\n> __Name:__ ${msg.channel.name}\n> __ID:__ ${msg.channel.id}`, true)
        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
        .addField("● Purge Info", `> Number of messages: **${clear}**`)
        .setTimestamp()

      modlog.send({ embeds: [log] })


    }



  }
}