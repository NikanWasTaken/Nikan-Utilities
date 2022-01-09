const { MessageEmbed, MessageActionRow, MessageButton, Message, Client } = require('discord.js')

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

    return message.reply({ content: "Command is on a progress at the moment, try again later..." })

    var permissions = [];
    let acknowments = "None";
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!args[0])
      member = message.member;

    const badges = {
      "EARLY_SUPPORTER": "<:EARLY_SUPPORTER:899171458297774160> ",
      "DISCORD_EMPLOYEE": "<:DISCORD_EMPLOYEE:899171458050306058> ",
      "PARTNERED_SERVER_OWNER": "<:PARTNERED_SERVER_OWNER:899171457995780106> ",
      "HYPESQUAD_EVENTS": "<:HYPESQUAD_EVENTS:899171458599755796> ",
      "TEAM_USER": "<:DISCORD_EMPLOYEE:899171458050306058> ",
      "VERIFIED_BOT": "<:NUbot:875668173419073546> ",
      "HOUSE_BRAVERY": "<:HOUSE_BRAVERY:899171455739265045> ",
      "HOUSE_BRILLIANCE": "<:HOUSE_BRILLIANCE:899171456414535721> ",
      "HOUSE_BALANCE": "<:HOUSE_BALANCE:899171458486505482> ",
      "BUGHUNTER_LEVEL_1": "<:BUGHUNTER_LEVEL_1:899171457718947851> ",
      "BUGHUNTER_LEVEL_2": "<:BUGHUNTER_LEVEL_2:899171457941245962> ",
      "EARLY_VERIFIED_BOT_DEVELOPER": "<:EARLY_VERIFIED_BOT_DEVELOPER:899171458444578836> ",
      "DISCORD_CERTIFIED_MODERATOR": "<:DISCORD_CERTIFIED_MODERATOR:899171456779419669> "
    };

    if (member) {

      if (
        member.permissions.has("BAN_MEMBERS") ||
        member.permissions.has("MANAGE_MESSAGES") ||
        member.permissions.has("KICK_MEMBERS")
      ) { acknowments = "Moderator" };

      if (member.permissions.has("ADMINISTRATOR")) { acknowments = "Administrator" };
      if (member.user.id === (await message.guild.fetchOwner()).id) { acknowments = 'Server Owner' };

      const flags = member.user.flags?.toArray()


      const components = (state) => [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("More Information")
            .setStyle("SECONDARY")
            .setDisabled(state)
            .setCustomId("whois"),
        )
      ]


      if (member.presence == null) {


        const eyes = new MessageEmbed()
          .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
          .setColor("RANDOM")
          .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
          .setTimestamp()
          .addField("__Account Information__", `**ID:** ${member.user.id}\n**Username:** ${member.user.username} • **Discriminator:** #${member.user.discriminator}\n**Registered:** <t:${Math.floor(member.user.createdAt / 1000)}:f> [<t:${Math.floor(member.user.createdAt / 1000)}:R>]\n**Avatar:** [JPG](${member.user.displayAvatarURL({ format: 'jpg' })}) • [PNG](${member.user.displayAvatarURL({ format: 'png' })}) • [WEBP](${member.user.displayAvatarURL()}) • [GIF](${member.user.displayAvatarURL({ format: 'gif', dynamic: true })})\n**Badges:** ${flags?.length ? `${flags.map(flag => badges[flag]).join(' ')}` : 'No Badges!'}`)
          .addField("__Server Member Info__", `**Joined:** <t:${~~(member.joinedAt / 1000)}:f> [<t:${~~(member.joinedAt / 1000)}:R>]\n**Booting since:** ${member.premiumSinceTimestamp ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:D>` : 'Not a server booster!'}\n**Nickname:** ${member.displayName === member.user.username ? "No Nickname" : `${member.displayName}`}\n**Highest Role:** ${member.roles.highest.id === message.guild.id ? "Doesn't have any role!" : member.roles.highest}\n**Acknowments:** ${know}\n\n\n`)

        const msg = await message.reply({ embeds: [eyes], components: components(false) })

        const collector = msg.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 60000,
        })

        collector.on("collect", async (collected) => {

          if (collected.customId === "whois") {

            if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

            const moreinfoembed = new MessageEmbed()
              .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
              .setTimestamp()
              .addField(`Roles [${Math.floor(member.roles.cache.size - 1)}]`, `${member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== message.guild.id).map(role => role.toString()).join(" ") || "Doesn't have any role!"}`, true)
              .addField(`Key Permissions [${permissions.length}]`, `${permissions.join(`, `)}`, false)


            collected.reply({ embeds: [moreinfoembed], ephemeral: true })

          }

        })

        collector.on("end", async (i) => { msg.edit({ components: components(true) }) })


      } else {


        const devices = member.presence.clientStatus || {}

        const eyes = new MessageEmbed()
          .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
          .setColor("RANDOM")
          .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
          .setTimestamp()
          .addField("__Account Information__", `**ID:** ${member.user.id}\n**Username:** ${member.user.username} • **Discriminator:** #${member.user.discriminator}\n**Registered:** <t:${Math.floor(member.user.createdAt / 1000)}:f> [<t:${Math.floor(member.user.createdAt / 1000)}:R>]\n**Avatar:** [JPG](${member.user.displayAvatarURL({ format: 'jpg' })}) • [PNG](${member.user.displayAvatarURL({ format: 'png' })}) • [WEBP](${member.user.displayAvatarURL()}) • [GIF](${member.user.displayAvatarURL({ format: 'gif', dynamic: true })})\n**Badges:** ${flags?.length ? `${flags.map(flag => badges[flag]).join(' ')}` : 'No Badges!'}`)
          .addField("__Server Member Info__", `**Joined:** <t:${~~(member.joinedAt / 1000)}:f> [<t:${~~(member.joinedAt / 1000)}:R>]\n**Booting since:** ${member.premiumSinceTimestamp ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:D>` : 'Not a server booster!'}\n**Nickname:** ${member.displayName === member.user.username ? "No Nickname" : `${member.displayName}`}\n**Highest Role:** ${member.roles.highest.id === message.guild.id ? "Doesn't have any role!" : member.roles.highest}\n**Acknowments:** ${know}\n\n\n`)
          .addField("__Presence Information__", `**Status:** ${client.cap(member.presence.status)}\n**Devices [${Object.entries(devices).length}]:** ${Object.entries(devices).map((value) => `${value[0][0].toUpperCase()}${value[0].slice(1)}`).join(", ")}`)

        const msg = await message.reply({ embeds: [eyes], components: components(false) })


        const collector = msg.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 60000,
        })

        collector.on("collect", async (collected) => {

          if (collected.customId === "whois") {

            if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

            const moreinfoembed = new MessageEmbed()
              .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
              .setTimestamp()
              .addField(`Roles [${Math.floor(member.roles.cache.size - 1)}]`, `${member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== message.guild.id).map(role => role.toString()).join(" ") || "Doesn't have any role!"}`, true)
              .addField(`Key Permissions [${permissions.length}]`, `${permissions.join(`, `)}`, false)


            collected.reply({ embeds: [moreinfoembed], ephemeral: true })

          }

        })

        collector.on("end", async (i) => { msg.edit({ components: components(true) }) })


      }

    } else if (!member) {

      const user = await client.users.fetch(`${args[0]}`).catch(e => { return message.reply("This user doesnt exist!") })
      const flags = user?.flags?.toArray()


      const embed = new MessageEmbed()
        .setAuthor(`${user?.tag}`, user?.displayAvatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setThumbnail(`${user?.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp()
        .addField("__Account Information__", `**ID:** ${user?.id}\n**Username:** ${user?.username} • **Discriminator:** #${user?.discriminator}\n**Registered:** <t:${Math.floor(user?.createdAt / 1000)}:f> [<t:${Math.floor(user?.createdAt / 1000)}:R>]\n**Avatar:** [JPG](${user?.displayAvatarURL({ format: 'jpg' })}) • [PNG](${user?.displayAvatarURL({ format: 'png' })}) • [WEBP](${user?.displayAvatarURL()}) • [GIF](${user?.displayAvatarURL({ format: 'gif', dynamic: true })})\n**Badges:** ${flags?.length ? `${flags.map(flag => badges[flag]).join(' ')}` : 'No Badges!'}`)

      message.reply({ embeds: [embed] })

    }


  }
}