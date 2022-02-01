const { MessageEmbed, Message, Client } = require('discord.js')
const ms = require("ms")
require(`${process.cwd()}/structures/GuildMember/mute`)

module.exports = {
  name: 'mute',
  category: 'moderation',
  description: `Mutes a user`,
  usage: "[user] <time> <reason>",
  aliases: ["timeout"],
  cooldown: 3000,
  permissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, wrongUsage) => {

    const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    let time = args[1];
    if (!args[1]) time = "6h";
    const reason = message.content.split(" ").slice(3).join(" ") || "No reason provided"

    if (!args[0]) return wrongUsage(message)

    let userNotFound = new MessageEmbed()
      .setDescription("This user isn't in this guild!")
      .setColor(`RED`);

    if (!user) return message.reply({ embeds: [userNotFound] }).then((msg) => {
      client.delete.message(message, msg);
    });

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot
    ) return message.reply({ embeds: [client.embeds.cannotPerform] }).then((msg) => {
      client.delete.message(message, msg);
    })

    if (!message.guild.roles.cache.get(`${client.server.mutedRole}`)) {
      const Server = client.guilds.cache.get(`${client.server.id}`);
      const embed = new MessageEmbed()
        .setDescription(`I couldn't find the muted role! Are you running the command in [${Server.name}](${client.server.invite})?`)
        .setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg);
      })
    };

    if (user.isCommunicationDisabled == true) {

      const embed = new MessageEmbed()
        .setDescription(`This user is already muted!`)
        .setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg);
      })
    };

    if (ms(time) === undefined) {

      const embed = new MessageEmbed()
        .setDescription(`I couldn't find out the duration of this mute!`)
        .setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg);
      })
    };

    if (ms(time) > 2332800000) {

      const embed = new MessageEmbed()
        .setDescription(`You can't mute users for more than 27 days!`)
        .setColor("RED")
      return message.reply({ embeds: [embed] }).then((msg) => {
        client.delete.message(message, msg);
      })
    };

    await user.mute({
      duration: time,
      msg: message,
      reason: reason,
      auto: false
    })
  }
}
