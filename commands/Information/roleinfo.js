const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const moment = require("moment")

module.exports = {
  name: 'roleinfo',
  category: 'information',
  description: "Get Info about a role!",
  usage: "[role ID]",
  cooldown: 5000,
  botCommandOnly: true,


  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, missingpartembed) => {

    let permissions = [];
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])

    if (!role) return message.reply({ embeds: [missingpartembed] })

    try {

      if (role.permissions.has("ADMINISTRATOR")) { permissions.push("Administrator") }
      if (role.permissions.has("MANAGE_ROLES")) { permissions.push("Manage Roles") }
      if (role.permissions.has("MANAGE_CHANNELS")) { permissions.push("Manage Channels") }
      if (role.permissions.has("MANAGE_MESSAGES")) { permissions.push("Manage Messages") }
      if (role.permissions.has("MANAGE_WEBHOOKS")) { permissions.push("Manage Webhooks") }
      if (role.permissions.has("MANAGE_NICKNAMES")) { permissions.push("Manage Nicknames") }
      if (role.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) { permissions.push("Manage Emojis And Stickers") }
      if (role.permissions.has("KICK_MEMBERS")) { permissions.push("Kick Members") }
      if (role.permissions.has("BAN_MEMBERS")) { permissions.push("Ban Members") }
      if (role.permissions.has("MENTION_EVERYONE")) { permissions.push("Mention Everyone") }
      if (permissions.length == 0) {
        permissions.push("No Key Permissions Found");
      }

      const components = (state) => [

        new MessageActionRow().addComponents(

          new MessageButton()
            .setLabel("Full Permissions")
            .setStyle("SECONDARY")
            .setDisabled(state)
            .setCustomId("roleinfo"),
        )
      ]

      //-----------------------------------------------------------------------


      const position = `\`${message.guild.roles.cache.size - role.position
        }\`/\`${message.guild.roles.cache.size}\``;

      const embed = new MessageEmbed()
        .setTimestamp()
        .setAuthor(role.name, message.guild.iconURL({ dynamic: true }))
        .setColor(role.color)
        .setFooter(`Role ID: ${role.id}`)
        .setDescription(`**● ${role.members.size}** people in this server have this role!`)
        .addField("Color", role.hexColor, true)
        .addField('Position', position, true)
        .addField("Creation Date", `\`${moment(role.createdAt).format("DD/MM/YYYY")}\``, true)
        .addField("● Advanced Info", `> Hoisted: ${role.hoist ? "✅" : "❌"}\n> Mentionable: ${role.mentionable ? "✅" : "❌"}\n> Bot Role: ${role.managed ? "✅" : "❌"}`, false)
        .addField("● Key Permissions", permissions.join(", "), false)

      const msg = await message.reply({ embeds: [embed], components: components(false) });


      const collector = msg.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 60000,
      })



      collector.on("collect", async (collected) => {

        if (collected.customId === "roleinfo") {

          const permissions = {
            "ADMINISTRATOR": "Administrator",
            "VIEW_AUDIT_LOG": "View Audit Log",
            "VIEW_GUILD_INSIGHTS": "View Server Insights",
            "MANAGE_GUILD": "Manage Server",
            "MANAGE_ROLES": "Manage Roles",
            "MANAGE_CHANNELS": "Manage Channels",
            "KICK_MEMBERS": "Kick Members",
            "BAN_MEMBERS": "Ban Members",
            "CREATE_INSTANT_INVITE": "Create Invite",
            "CHANGE_NICKNAME": "Change Nickname",
            "MANAGE_NICKNAMES": "Manage Nicknames",
            "MANAGE_EMOJIS_AND_STICKERS": "Manage Emojis",
            "MANAGE_WEBHOOKS": "Manage Webhooks",
            "VIEW_CHANNEL": "Read Text Channels & See Voice Channels",
            "SEND_MESSAGES": "Send Messages",
            "SEND_TTS_MESSAGES": "Send TTS Messages",
            "MANAGE_MESSAGES": "Manage Messages",
            "EMBED_LINKS": "Embed Links",
            "ATTACH_FILES": "Attach Files",
            "READ_MESSAGE_HISTORY": "Read Message History",
            "MENTION_EVERYONE": "Mention @everyone, @here, and All Roles",
            "USE_EXTERNAL_EMOJIS": "Use External Emojis",
            "ADD_REACTIONS": "Add Reactions",
            "CONNECT": "Connect",
            "SPEAK": "Speak",
            "STREAM": "Video",
            "MUTE_MEMBERS": "Mute Members",
            "DEAFEN_MEMBERS": "Deafen Members",
            "MOVE_MEMBERS": "Move Members",
            "USE_VAD": "Use Voice Activity",
            "PRIORITY_SPEAKER": "Priority Speaker"
          }

          const rolePermissions = role.permissions.toArray();
          const finalPermissions = [];
          for (const permission in permissions) {
            if (rolePermissions.includes(permission)) finalPermissions.push(`✅ ${permissions[permission]}`);
            else finalPermissions.push(`❌ ${permissions[permission]}`);
          }

          if (collected.user.id !== message.author.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })

          const e = new MessageEmbed()
            .setTimestamp()
            .setAuthor(role.name, message.guild.iconURL({ dynamic: true }))
            .setColor(role.color)
            .setDescription(`These are all the permissions for the ${role} role. `)
            .addField("Full Permission List", `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)


          collected.reply({ embeds: [e], ephemeral: true })

        }

      })

      collector.on("end", async (i) => { msg.edit({ components: components(true) }) })


      // -----

    } catch (error) {
      message.reply("Can't find that role.")
      console.log(error)
    }

  },
};