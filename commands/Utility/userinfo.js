const { MessageEmbed, MessageActionRow, MessageButton, Message, Client } = require('discord.js');

module.exports = {
  name: 'userinfo',
  category: 'utility',
  description: `Gets information about an user`,
  aliases: ['whois'],
  cooldown: 5000,
  usage: `<user>`,
  botCommand: true,


  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    const devServer = client.guilds.cache.get("869805946854068281");
    let user;
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (member) user = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user
    if (!member) {
      user = await client.users.fetch(`${args[0]}`).catch(() => { })
    }
    if (!args[0]) {
      member = message.member,
        user = message.author;
    }
    if (!member && !user) return message.reply("This user doesn't exist!")

    const badgesArray = [];

    user?.flags?.toArray().forEach(badge => {
      const findEmoji = devServer.emojis.cache.find(emoji => emoji.name == badge)
      badgesArray.push(`${findEmoji} • ${client.cap(badge.toString().replaceAll("_", " "))}`)
    })

    const components = (options) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Account")
          .setStyle(options.style1 || "PRIMARY")
          .setDisabled(options.disable1 ? options.disable1 : false)
          .setCustomId("whois-account"),

        new MessageButton()
          .setLabel("Guild")
          .setStyle(options.style2 || "PRIMARY")
          .setDisabled(options.disable2 ? options.disable2 : false)
          .setCustomId("whois-guild"),

        new MessageButton()
          .setLabel("Roles")
          .setStyle(options.style3 || "PRIMARY")
          .setDisabled(options.disable3 ? options.disable3 : false)
          .setCustomId("whois-roles"),

        new MessageButton()
          .setLabel("Permissions")
          .setStyle(options.style4 || "PRIMARY")
          .setDisabled(options.disable4 ? options.disable4 : false)
          .setCustomId("whois-permissions"),

        new MessageButton()
          .setLabel("Activities")
          .setStyle(options.style5 || "PRIMARY")
          .setDisabled(options.disable5 ? options.disable5 : false)
          .setCustomId("whois-activities"),
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
        return `${user?.displayAvatarURL({ dynamic: true, format: 'gif', size: 1024 })}`
      } else {
        return `${user?.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })}`
      }
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: `${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${user} • ID: ${user?.id}`)
      .setColor("RANDOM")
      .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)
      .addFields(
        [
          {
            name: "Account Information",
            value: [
              `• **ID:** ${user?.id}`,
              `• **Username:** ${user?.username}`,
              `• **Discriminator:** #${user?.discriminator}`,
              `• **Registered:** <t:${~~(user?.createdAt / 1000)}:f> [<t:${~~(user?.createdAt / 1000)}:R>]`,
              `• **Bot:** ${user?.bot ? `${client.emoji.success}` : `${client.emoji.fail}`}`
            ].join("\n")
          },
          {
            name: "Profile Picture",
            value: [
              `• **Animated:** ${user?.displayAvatarURL({ dynamic: true }).endsWith(".gif") ? `${client.emoji.success}` : `${client.emoji.fail}`}`,
              `• **Formats:** ${AvatarFormatCheck(user)}`,
              `• **Download:** [Click Here](${downloadLinkFormatCheck(user)})`
            ].join("\n")
          }, {
            name: `Badges [${badgesArray.length}]`,
            value: `${badgesArray.length ? `${badgesArray.join("\n")}` : "No badges found"}`
          }
        ]
      )

    let msg = await message.channel.send({
      embeds: [embed],
      components: components({
        style1: "SUCCESS",
        style2: "PRIMARY",
        style3: "PRIMARY",
        style4: "PRIMARY",
        disable1: true
      })
    })

    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 30000
    })


    collector.on("collect", (collected) => {

      const PermissionsArray = [];

      if (collected.user?.id !== message.author.id) return collected.reply({
        content: "This menu isn't for you!",
        ephemeral: true
      })

      switch (collected.customId) {
        case "whois-account":
          msg.edit({
            embeds: [embed],
            components: components({
              style1: "SUCCESS",
              style2: "PRIMARY",
              style3: "PRIMARY",
              style4: "PRIMARY",
              disable1: true,
              disable2: false,
              disable3: false,
              disable4: false,
            })
          })
          collected.deferUpdate()
          break;

        case "whois-guild":
          const embedServer = new MessageEmbed()
            .setAuthor({ name: `${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${user} • ID: ${user?.id}`)
            .setColor("RANDOM")
            .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)

          if (member) {

            let acknowments = "None";
            if (
              member.permissions.has("BAN_MEMBERS") ||
              member.permissions.has("MANAGE_MESSAGES") ||
              member.permissions.has("KICK_MEMBERS") ||
              member.permissions.has("MANAGE_ROLES")
            ) { acknowments = "Moderator" };
            if (member.permissions.has("MANAGE_EVENTS")) { acknowments = "Event Manager" };
            if (member.permissions.has("MANAGE_GUILD")) { acknowments = "Server Manager" };
            if (member.permissions.has("ADMINISTRATOR")) { acknowments = "Administrator" };
            if (user?.id === message.guild.ownerId) { acknowments = 'Server Owner' }

            ; embedServer
              .addFields(
                [
                  {
                    name: `Information in ${message.guild.name}`,
                    value: [
                      `• ** Joined:** <t:${~~(member.joinedAt / 1000)}:f> [<t:${~~(member.joinedAt / 1000)}:R>]`,
                      `• **Nickname:** ${member.displayName === member.user?.username ? "No Nickname" : `${member.displayName}`}`,
                      `• **Booster:** ${member.premiumSinceTimestamp ? `${client.emoji.success}` : `${client.emoji.fail}`}`,
                      `• **Boosting Since:** ${member.premiumSinceTimestamp ? `<t:${~~(member.premiumSinceTimestamp / 1000)}:f> [<t:${~~(member.premiumSinceTimestamp / 1000)}:R>]` : "Not boosting the server!"}`,
                      `• **Acknowments:** ${acknowments}`
                    ].join("\n")
                  }
                ]
              )

          } else if (!member) {

            embedServer
              .addFields(
                [
                  {
                    name: "Something went wrong",
                    value: `I've searched far.. and wide.. but I couldn't find this user in this server!`
                  }
                ]
              )

          }

          msg.edit({
            embeds: [embedServer],
            components: components({
              style1: "PRIMARY",
              style2: "SUCCESS",
              style3: "PRIMARY",
              style4: "PRIMARY",
              disable1: false,
              disable2: true,
              disable3: false,
              disable4: false,
            })
          })
          collected.deferUpdate()
          break;

        case "whois-roles":

          const embedRoles = new MessageEmbed()
            .setAuthor({ name: `${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
            .setColor("RANDOM")
            .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)

          if (member) {

            const roles = member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== message.guildId);

            embedRoles
              .setDescription(`${user} • ID: ${user?.id}\n\n**Roles [${roles.size}]**\n${roles.size ? roles.map(role => role).join(' ') : "No roles"}`)

          } else if (!member) {

            embedRoles
              .setDescription(`${user} • ID: ${user?.id}`)
              .addFields(
                [
                  {
                    name: "Something went wrong",
                    value: `I've searched far.. and wide.. but I couldn't find this user in this server!`
                  }
                ]
              )

          }

          msg.edit({
            embeds: [embedRoles],
            components: components({
              style1: "PRIMARY",
              style2: "PRIMARY",
              style3: "SUCCESS",
              style4: "PRIMARY",
              disable1: false,
              disable2: false,
              disable3: true,
              disable4: false,
            })
          })
          collected.deferUpdate()
          break;

        case "whois-permissions":

          const embedPermissions = new MessageEmbed()
            .setAuthor({ name: `${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
            .setColor("RANDOM")
            .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)

          if (member) {

            const permissions = member.permissions?.toArray();
            permissions.forEach(role => {
              PermissionsArray.push(`${client.cap(role.toString().replaceAll("_", ' '))}`);
            })

            embedPermissions
              .setDescription(`${member.user} • ID: ${member.user?.id}\n\n**Permissions [${permissions.length}]**\n${permissions.length ? `${PermissionsArray.join(", ")}` : "No Permissions"}`)

          } else if (!member) {

            embedPermissions
              .setDescription(`${user} • ID: ${user?.id}`)
              .addFields(
                [
                  {
                    name: "Something went wrong",
                    value: `I've searched far.. and wide.. but I couldn't find this user in this server!`
                  }
                ]
              )
          }

          msg.edit({
            embeds: [embedPermissions],
            components: components({
              style1: "PRIMARY",
              style2: "PRIMARY",
              style3: "PRIMARY",
              style4: "SUCCESS",
              disable1: false,
              disable2: false,
              disable3: false,
              disable4: true,
            })
          })
          collected.deferUpdate()
          break;

        case "whois-activities":

          const activitiesEmbed = new MessageEmbed()
            .setAuthor({ name: `${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
            .setColor("RANDOM")
            .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)

          if (member) {

            if (
              member &&
              ["idle", "dnd", "online"]?.includes(member?.presence?.status)
            ) {

              const devices = member?.presence?.clientStatus || {}
              activitiesEmbed.addFields(
                [
                  {
                    name: `• Presence`,
                    value: [
                      `**Status:** ${client.cap(member?.presence?.status)}`,
                      `**Devices [${Object.entries(devices).length}]:** ${Object.entries(devices).map((value) => `${value[0][0].toUpperCase()}${value[0].slice(1)}`).join(", ")}`,
                    ].join("\n")
                  }
                ]
              )

              if (member?.presence?.activities !== []) {
                activitiesEmbed.addFields(
                  member?.presence?.activities
                    ?.map(activity => {
                      return {
                        name: `• ${activity.name}`,
                        value: [
                          `${activity.type === "CUSTOM" ? '' : activity.details}`,
                          `${activity.state}`,
                        ].join("\n")
                      }
                    })
                )
              }

            } else {

              activitiesEmbed.addFields(
                [
                  {
                    name: "Something went wrong",
                    value: `Whoops, looks like that person is currently offline or invisible.`
                  }
                ]
              )
            }

          } else if (!member) {

            activitiesEmbed
              .setDescription(`${user} • ID: ${user?.id} `)
              .addFields(
                [
                  {
                    name: "Something went wrong",
                    value: `I've searched far.. and wide.. but I couldn't find this user in this server!`
                  }
                ]
              )
          }

          msg.edit({
            embeds: [activitiesEmbed],
            components: components({
              style1: "PRIMARY",
              style2: "PRIMARY",
              style3: "PRIMARY",
              style4: "PRIMARY",
              style5: "SUCCESS",
              disable1: false,
              disable2: false,
              disable3: false,
              disable4: false,
              disable5: true,
            })
          })
          collected.deferUpdate()

      }
    })

    collector.on("end", () => {
      msg.edit({
        components: []
      })
    })
  }
}