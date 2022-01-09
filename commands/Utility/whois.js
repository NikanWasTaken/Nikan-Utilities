const { MessageEmbed, MessageActionRow, MessageButton, Message, Client, ThreadChannel } = require('discord.js')

module.exports = {
  name: 'whois',
  category: 'utility',
  description: `Gets information about an user`,
  aliases: ['userinfo'],
  cooldown: 5000,
  usage: `<user>`,
  botCommand: true,


  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async ({ client, message, args }) => {

    const devServer = client.guilds.cache.get("869805946854068281");
    const badgesArray = [];
    let acknowments = "None";
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!args[0])
      member = message.member;

    if (member) {

      if (
        member.permissions.has("BAN_MEMBERS") ||
        member.permissions.has("MANAGE_MESSAGES") ||
        member.permissions.has("KICK_MEMBERS") ||
        member.permissions.has("MANAGE_ROLES")
      ) { acknowments = "Moderator" };
      if (member.permissions.has("MANAGE_EVENTS")) { acknowments = "Event Manager" };
      if (member.permissions.has("MANAGE_GUILD")) { acknowments = "Server Manager" };
      if (member.permissions.has("ADMINISTRATOR")) { acknowments = "Administrator" };
      if (member.user.id === (await message.guild.fetchOwner()).id) { acknowments = 'Server Owner' };

      member.user.flags?.toArray().forEach(badge => {
        const findEmoji = devServer.emojis.cache.find(emoji => emoji.name == badge)
        badgesArray.push(`${findEmoji} • ${client.cap(badge.toString().replaceAll("_", " "))}`)
      })

      const components = (options) => [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Account")
            .setStyle(options.style1 || "PRIMARY")
            .setDisabled(options.disable ? options.disable : false)
            .setCustomId("whois-account"),

          new MessageButton()
            .setLabel("Guild")
            .setStyle(options.style2 || "PRIMARY")
            .setDisabled(options.disable ? options.disable : false)
            .setCustomId("whois-guild"),

          new MessageButton()
            .setLabel("Roles")
            .setStyle(options.style3 || "PRIMARY")
            .setDisabled(options.disable ? options.disable : false)
            .setCustomId("whois-roles"),

          new MessageButton()
            .setLabel("Permissions")
            .setStyle(options.style4 || "PRIMARY")
            .setDisabled(options.disable ? options.disable : false)
            .setCustomId("whois-permissions"),
        )
      ]


      const AvatarFormatCheck = function (user) {
        const avatarURL = user?.displayAvatarURL({ dynamic: true })

        if (avatarURL.endsWith(".gif")) {
          return [
            `[WEBP](${user?.displayAvatarURL({ dynamic: true, format: 'webp', size: 1024 })})`,
            `[GIF](${user?.displayAvatarURL({ dynamic: true, format: 'gif', size: 1024 })})`,
          ].join(" • ")
        } else {
          return [
            `[WEBP](${user?.displayAvatarURL({ format: 'webp', size: 1024 })})`,
            `[JPEG](${user?.displayAvatarURL({ format: 'jpeg', size: 1024 })})`,
            `[JPG](${user?.displayAvatarURL({ format: 'jpg', size: 1024 })})`,
            `[PNG](${user?.displayAvatarURL({ format: 'png', size: 1024 })})`,
          ].join(" • ")
        }
      }

      const downloadLinkFormatCheck = function (user) {
        const avatar = user?.displayAvatarURL()

        if (avatar.endsWith(".gif")) {
          return `${user.displayAvatarURL({ dynamic: true, format: 'gif', size: 1024 })}`
        } else {
          return `${user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })}`
        }
      }

      const embed = new MessageEmbed()
        .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${member.user} • ID: ${member.user.id}`)
        .setColor("RANDOM")
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .addFields(
          [
            {
              name: "Account Information",
              value: [
                `• **ID:** ${member.user.id}`,
                `• **Username:** ${member.user.username}`,
                `• **Discriminator:** #${member.user.discriminator}`,
                `• **Registered:** <t:${~~(member.user.createdAt / 1000)}:f> [<t:${~~(member.user.createdAt / 1000)}:R>]`,
                `• **Bot:** ${member.user.bot ? `${client.emoji.success}` : `${client.emoji.fail}`}`
              ].join("\n")
            },
            {
              name: "Profile Picture",
              value: [
                `• **Animated:** ${member.user.displayAvatarURL({ dynamic: true }).endsWith(".gif") ? `${client.emoji.success}` : `${client.emoji.fail}`}`,
                `• **Formats:** ${AvatarFormatCheck(member.user)}`,
                `• **Download:** [Click Here](${downloadLinkFormatCheck(member.user)})`
              ].join("\n")
            }, {
              name: "Badges",
              value: `${badgesArray.length ? `${badgesArray.join("\n")}` : "No badges found"}`
            }
          ]
        )

      let msg = await message.channel.send({
        embeds: [embed],
        components: components({ style1: "SUCCESS" })
      })

      const collector = msg.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 30000
      })

      collector.on("collect", (collected) => {

        const PermissionsArray = [];

        if (collected.user.id !== message.author.id) return collected.reply({
          content: "This menu isn't for you!",
          ephemeral: true
        })

        switch (collected.customId) {
          case "whois-account":
            msg.edit({
              embeds: [embed],
              components: components({ style1: "SUCCESS", style2: "PRIMARY", style3: "PRIMARY", style4: "PRIMARY" })
            })
            collected.deferUpdate()
            break;

          case "whois-guild":
            const embedServer = new MessageEmbed()
              .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`${member.user} • ID: ${member.user.id}`)
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL()}`)
              .addFields(
                [
                  {
                    name: `Information in ${message.guild.name}`,
                    value: [
                      `• **Joined:** <t:${~~(member.joinedAt / 1000)}:f> [<t:${~~(member.joinedAt / 1000)}:R>]`,
                      `• **Nickname:** ${member.displayName === member.user.username ? "No Nickname" : `${member.displayName}`}`,
                      `• **Booster:** ${member.premiumSinceTimestamp ? `${client.emoji.success}` : `${client.emoji.fail}`}`,
                      `• **Boosting Since:** ${member.premiumSinceTimestamp ? `<t:${~~(member.premiumSinceTimestamp / 1000)}:f> [<t:${~~(member.premiumSinceTimestamp / 1000)}:R>]` : "Not boosting the server!"}`,
                      `• **Acknowments:** ${acknowments}`
                    ].join("\n")
                  }
                ]
              )

            msg.edit({
              embeds: [embedServer],
              components: components({ style1: "PRIMARY", style2: "SUCCESS", style3: "PRIMARY", style4: "PRIMARY" })
            })
            collected.deferUpdate()
            break;

          case "whois-roles":
            const roles = member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== message.guildId);
            const embedRoles = new MessageEmbed()
              .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`${member.user} • ID: ${member.user.id}\n\n**Roles [${roles.size}]**\n${roles.size ? roles.map(role => role).join(' ') : "No roles"}`)
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL()}`)

            msg.edit({
              embeds: [embedRoles],
              components: components({ style1: "PRIMARY", style2: "PRIMARY", style3: "SUCCESS", style4: "PRIMARY" })
            })
            collected.deferUpdate()
            break;

          case "whois-permissions":
            const permissions = message.member.permissions?.toArray();
            permissions.forEach(role => {
              PermissionsArray.push(`${client.cap(role.toString().replaceAll("_", ' '))}`);
            })
            const embedPermissions = new MessageEmbed()
              .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`${member.user} • ID: ${member.user.id}\n\n**Permissions [${permissions.length}]**\n${permissions.length ? `${PermissionsArray.join(", ")}` : "No Permissions"}`)
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL()}`)

            msg.edit({
              embeds: [embedPermissions],
              components: components({ style1: "PRIMARY", style2: "PRIMARY", style3: "PRIMARY", style4: "SUCCESS" })
            })
            collected.deferUpdate()
            break;
        }
      })

      collector.on("end", () => {
        msg.edit({
          components: components({
            style1: "SECONDARY",
            style2: "SECONDARY",
            style3: "SECONDARY",
            style4: "SECONDARY",
            disable: true
          })
        })
      })

    } else if (!member) {

      return message.reply("User's out the the guild feature will come very soon!")

      const user = await client.users.fetch(`${args[0]}`).catch(e => { return message.reply("This user doesnt exist!") })
      const flags = user?.flags?.toArray()


      const embed = new MessageEmbed()
        .setAuthor(`${user?.tag}`, user?.displayAvatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()
        .addField("__Account Information__", `** ID:** ${user?.id}\n ** Username:** ${user?.username} • ** Discriminator:** #${user?.discriminator}\n ** Registered:** <t:${Math.floor(user?.createdAt / 1000)}: <t:${Math.floor(user?.createdAt / 1000)}: {user?.displayAvatarURL({ format: 'jpg' })}) •[PNG](${user?.displayAvatarURL({ format: 'png' })}) •[WEBP](${user?.displayAvatarURL()}) •[GIF](${user?.displayAvatarURL({ format: 'gif', dynamic: true })}) \n ** Badges:** ${flags?.length ? `${flags.map(flag => badges[flag]).join(' ')}` : 'No Badges!'} `)

      message.reply({ embeds: [embed] })

    }


  }
}