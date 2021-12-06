const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const warnModel = require("../../models/Punishments.js")
const db = require("../../models/MemberRoles.js")
const ms = require("ms")


module.exports = {
  name: 'warn',
  category: 'moderation',
  description: `Warns a user in the server`,
  usage: '[user] [reason]',
  cooldown: 3000,
  userPermissions: ["MANAGE_MESSAGES"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, missingpartembed) => {


    const user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    const reason = args.slice(1).join(" ")

    if (!args[0] || !reason) return message.reply({ embeds: [missingpartembed] })

    if (!user) {
      const embed = new MessageEmbed().setDescription(`This user is not in this guild!`).setColor("RED")
      message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
      })
    }


    const failed = new MessageEmbed().setDescription(`You don't have permissions to perform that action!`).setColor("RED")

    if (user.roles.highest.position >= message.guild.me.roles.highest.position ||
      user.roles.highest.position >= message.member.roles.highest.position ||
      user.user.id === client.config.owner ||
      user.user.bot)
      return message.reply({ embeds: [failed] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 5000)
      })

    if (client.warncooldown.has(`${user.user.id}`)) {
      const embed = new MessageEmbed()
        .setDescription("Whoops, looks like there is a double warning here!")
        .setColor("RED")

      return message.channel.send({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg?.delete()
          message?.delete()
        }, 10000)
      })

    }

    const data = new warnModel({
      type: "Warn",
      userId: user.user.id,
      guildId: message.guild.id,
      moderatorId: message.author.id,
      reason,
      timestamp: Date.now(),
      expires: Date.now() + ms('4 weeks')
    })
    data.save();


    let warndm = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been Warned in ${message.guild.name}`)
      .addField("Punishment ID", `${data._id}`, true)
      .addField("Expires In", `4 weeks`, true)
      .addField("Reason", reason, false)
      .setColor(`${client.embedColor.modDm}`)
      .setTimestamp()
    user.send({ embeds: [warndm] }).catch(e => { return })

    let warne = new MessageEmbed()
      .setDescription(`${user} has been **warned** | \`${data._id}\``)
      .setColor(`${client.embedColor.moderation}`)

    let msg = await message.channel.send({ embeds: [warne] }).then(message.delete())
    client.warncooldown.set(
      `${user.user.id}`,
    );
    setTimeout(() => {
      client.warncooldown.delete(`${user.user.id}`);
    }, 10000);


    let log = new MessageEmbed()
      .setAuthor(`Moderation • Warn`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`** **`)
      .setColor(`${client.embedColor.logs}`)
      .addField('👥 User', `Mention • ${user.user}\nTag • ${user.user.tag}\nID • ${user.user.id}`, true)
      .addField("<:NUhmod:910882014582951946> Moderator", `Mention • ${message.author}\nTag • ${message.author.tag}\nID • ${message.author.id}`, true)
      .addField("Punishment ID", `${data._id}`)
      .addField("Reason", `${reason}`)
      .setTimestamp()

    const rowlog = new MessageActionRow().addComponents(

      new MessageButton()
        .setLabel("Jump to the action")
        .setStyle("LINK")
        .setURL(`https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)

    )

    client.webhook.moderation.send({ embeds: [log], components: [rowlog] })

    // ---- checks for 3 stikes, 6 and 9 strikes...

    const userWarnings = await warnModel.find({
      userId: user.user.id,
      guildId: message.guild.id,
      type: "Warn",
    });
    const numberofwarns = []
    userWarnings.map((warn, i) => {
      numberofwarns.push(`${i + 1}`)
    })


    if (numberofwarns.length == 2) {

      const data = new db({
        guildid: message.guild.id,
        user: user.user.id,
        roles: [user.roles.cache.map(role => role.id)],
        reason: "Muted for reaching 2 strikes"
      })
      data.save()

      const data2 = new warnModel({
        type: "Mute",
        userId: user.user.id,
        guildId: message.guild.id,
        moderatorId: `${client.user.id}`,
        reason: "Reaching 2 Strikes",
        timestamp: Date.now(),
        expires: Date.now() + ms('4 weeks')
      })

      data2.save()

      user.roles.set(["795353284042293319"])

      let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Muted in ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", "2 hours", true)
        .addField("Reason", "Reaching 2 strikes", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
      user.send({ embeds: [warndm] }).catch(e => { return })

      const warns2 = new MessageEmbed()
        .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
        .setColor(`${client.embedColor.mute}`)
        .setTitle("➜ 2 Hours Of Mute")
        .addField("User", `• ${user.user}`, true)
        .addField("User Tag", `• ${user.user.tag}`, true)
        .addField("User ID", `• ${user.user.id}`, true)
        .addField("Reason", `Reached 2 normal strikes!`)
        .setFooter(`ID: ${data2._id}`)

      client.webhook.autoaction.send({ embeds: [warns2] })


      setTimeout(async () => {

        const findmember = message.guild.members.cache.get(`${user.user.id}`)

        if (findmember) {

          db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              data.roles.map((w, i) => user.roles.set(w))
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })


        } else if (!findmember) {

          const leftroles = require("../../models/LeftMembers.js")

          db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              leftroles.findOneAndUpdate({ guildid: message.guild.id, user: `${user.user.id}` }, { $set: { roles: [data.roles.map(e => e)] } }, async (data, err) => { })
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })
        }

        const warns2 = new MessageEmbed()
          .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
          .setColor(`${client.embedColor.unmute}`)
          .setTitle("Unmuted From Tempmute")
          .addField("User", `• ${user.user}`, true)
          .addField("User Tag", `• ${user.user.tag}`, true)
          .addField("User ID", `• ${user.user.id}`, true)
          .addField("Reason", `Umuted After 2 hours of mute (reaching 2 strikes)`)

        client.webhook.autoaction.send({ embeds: [warns2] })

      }, 7200000) // 2 hours

    } else if (numberofwarns.length == 4) {

      const data = new db({
        guildid: message.guild.id,
        user: user.user.id,
        roles: [user.roles.cache.map(role => role.id)],
        reason: "Muted for reaching 4 strikes!"
      })
      data.save()

      const data2 = new warnModel({
        type: "Mute",
        userId: user.user.id,
        guildId: message.guild.id,
        moderatorId: `${client.user.id}`,
        reason: "Reaching 4 Strikes",
        timestamp: Date.now(),
        expires: Date.now() + ms('4 weeks')
      })

      data2.save()

      user.roles.set(["795353284042293319x"])

      let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Muted in ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Duration", "6 hours", true)
        .addField("Reason", "Reaching 4 strikes", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
      user.send({ embeds: [warndm] }).catch(e => { return })

      const warns2 = new MessageEmbed()
        .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
        .setColor(`${client.embedColor.mute}`)
        .setTitle("➜ 6 Hours Of Mute")
        .addField("User Mention", `• ${user.user}`, true)
        .addField("User Tag", `• ${user.user.tag}`, true)
        .addField("User ID", `• ${user.user.id}`, true)
        .addField("Reason", `Reached 4 normal strikes!`)
        .setFooter(`ID: ${data2._id}`)

      client.webhook.autoaction.send({ embeds: [warns2] })


      setTimeout(async () => {

        const findmember = message.guild.members.cache.get(`${user.user.id}`)

        if (findmember) {

          db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              data.roles.map((w, i) => user.roles.set(w))
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })


        } else if (!findmember) {

          const leftroles = require("../../models/LeftMembers.js")

          db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {

              leftroles.findOneAndUpdate({ guildid: message.guild.id, user: `${user.user.id}` }, { $set: { roles: [data.roles.map(e => e)] } }, async (data, err) => { })
              await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id })

            }
          })
        }

        const warns2 = new MessageEmbed()
          .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
          .setColor(`${client.embedColor.unmute}`)
          .setTitle("Unmuted From Tempmute")
          .addField("User", `• ${user.user}`, true)
          .addField("User Tag", `• ${user.user.tag}`, true)
          .addField("User ID", `• ${user.user.id}`, true)
          .addField("Reason", `Umuted After 6 hours of mute (reaching 4 strikes)`)

        client.webhook.autoaction.send({ embeds: [warns2] })

      }, 21600000) // 6 hours


    } else if (numberofwarns.length == 6) {


      const data2 = new warnModel({
        type: "Ban",
        userId: user.user.id,
        guildId: message.guild.id,
        moderatorId: `${client.user.id}`,
        reason: "Reaching 6 Strikes",
        timestamp: Date.now(),
      })
      data2.save()

      let warndm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Banned from ${message.guild.name}`)
        .addField("Punishment ID", `${data2._id}`, true)
        .addField("Reason", "Reaching 6 strikes", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
      user.send({ embeds: [warndm] }).catch(e => { return })

      user.ban({
        reason: "Reaching 6 stikes!"
      })

      const warns2 = new MessageEmbed()
        .setAuthor(`Automatic Actions`, `${client.user.displayAvatarURL()}`)
        .setColor(`${client.embedColor.ban}`)
        .setTitle("➜ Ban")
        .addField("User Mention", `• ${user.user}`, true)
        .addField("User Tag", `• ${user.user.tag}`, true)
        .addField("User ID", `• ${user.user.id}`, true)
        .addField("Reason", `Reached 6 normal strikes!`)
        .setFooter(`ID: ${data2._id}`)

      client.webhook.autoaction.send({ embeds: [warns2] })

    }


  },
};