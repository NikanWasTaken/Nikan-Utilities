const { Client, CommandInteraction, MessageEmbed} = require("discord.js");
const ms = require("ms")
const db = require("../../models/MemberRoles.js")
const warnModel = require("../../models/Punishments.js")

module.exports = {
    name: "mute",
    description : `Mutes a member in the server!`,
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
      {
        name: "add",
        description: "Mutes a member for a specific time!",
        type: "SUB_COMMAND",
        options: [
          {
            name: "user",
            description: "The user you want to mute!",
            required: true,
            type: "USER",
  
          },
          {
              name: "duration",
              description: "The duration that you want to mute the user.",
              required: false,
              type: "STRING",
    
            },
          {
              name: "reason",
              description: "The reason of the mute!",
              required: false,
              type: "STRING",
    
            }
        ]
      },
      {
        name: "remove",
        description: "Unmutes a member!",
        type: "SUB_COMMAND",
        options: [
          {
            name: "user",
            description: "The user you want to unmute!",
            required: true,
            type: "USER",
          }
        ]

      }
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, modlog) => {

      const subs = interaction.options.getSubcommand(["add", "remove"])


      if(subs == "add") {

      var user = interaction.options.getMember("user")
      let time = interaction.options.getString("duration") || "6h"
      let reason = interaction.options.getString("reason") || "No reason provided"
  
      let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't mute that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
      let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't mute that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
      if(user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot]})
      if (user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })
  
      if (!user.roles.cache.some(role => role.id === '795353284042293319')) {
  
        const data = new db({
          guildid: interaction.guild.id,
          user: user.user.id,
          content: [{ roles: user.roles.cache.map(role => role.id), reason: "Collecting the roles after the mute!" }]
        })
  
        data.save()

        const data2 = new warnModel({
          type: "Mute",
          userId: user.user.id,
          guildId: interaction.guildId,
          moderatorId: interaction.user.id,
          reason,
          timestamp: Date.now(),
      })

      data2.save()
      
      user.roles.set(null).then(
        setTimeout(() => {
          user.roles.add("795353284042293319")
        }, 3000)
      )
  
        let mue = new MessageEmbed()
          .setDescription(`${user.user} has been **muted** | \`${data2._id}\``)
          .setColor(`${client.embedColor.moderation}`)
        interaction.followUp({ embeds: [mue] })
        var duration = ms(time)
  
        let mm = new MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`You've been Muted in ${interaction.guild.name}`)
          .setColor(`${client.embedColor.modDm}`)
          .setTimestamp()
          .setFooter(`Server ID: ${interaction.guild.id}`)
          .addField("Punishment ID", `${data2._id}`, true)
          .addField("Duration", `${ms(duration, { long: true })}`, true)
          .addField("Reason", `${reason}`, false)
        user.send({ embeds: [mm] }).catch(e => { return })
  
  
        let log = new MessageEmbed()
          .setAuthor(`Action: Mute`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logYellow}`)
          .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
          .addField("Mod Info", `● ${interaction.author}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .addField("● Mute Info", `> Reason: ${reason}\n> Duration: ${ms(duration, { long: true })}\n> Punishment ID: ${data2._id}`)
          .setTimestamp()
        modlog.send({ embeds: [log] })
  
      } else {
        let uu = new MessageEmbed().setDescription(`${client.embedColor.failed} That user is already muted.`).setColor(`${client.embedColor.failed}`)
        interaction.followUp({ embeds: [uu] })
      }
  
  
      setTimeout(async () => {

        db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
          if (err) throw err;
          if (data) {
            data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
             db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })
          }
  
        })
  
        let log = new MessageEmbed()
          .setAuthor(`Action: Unmute`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logGreen}`)
          .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
          .addField("● Mod Info", `> Mute: ${interaction.member.user}\n> Unmute: Auto`, true)
          .addField("● Mute Info", `> Reason: ${reason}\n> Unmuted After ${ms(duration, { long: true })}`)
          .setTimestamp()
  
        modlog.send({ embeds: [log] })
      }, ms(time))
  
    } else if(subs == "remove") {

      var user = interaction.options.getMember("user")

      let xxpermuser = new MessageEmbed().setDescription("<a:NU_xmark:872203367718457424> You can't unmute this user as they can't be muted.").setColor("RED")
      let xxpermbot = new MessageEmbed().setDescription("<a:NU_xmark:872203367718457424> I can't unmute this user as they can't be muted.").setColor("RED")
      if(user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot]})
      if (user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })

      
          db.findOne({ guildid: interaction.guild.id, user: user.user.id }, async (err, data) => {
              if (err) throw err;
              if (data) {
                  data.content.map((w, i) => user.roles.set(w.roles).then(user.roles.remove("795353284042293319")))
                await db.findOneAndDelete({ user: user.user.id, guildid: interaction.guild.id })

                let mue = new MessageEmbed()
                .setDescription(`${user.user} has been **unmuted**`)
                .setColor(`${client.embedColor.moderation}`)
              interaction.followUp({ embeds: [mue] })
     
     
              let log = new MessageEmbed()
              .setAuthor(`Action: Unmute`, interaction.guild.iconURL({ dynamic: true }))
              .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
              .setColor(`${client.embedColor.logGreen}`)
              .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
              .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
              .setTimestamp()
              modlog.send({ embeds: [log]})
     
             } else {
                let uu = new MessageEmbed().setDescription(`${client.botEmoji.failed} That user is not muted.`).setColor(`${client.embedColor.failed}`)
                 interaction.followUp({ embeds: [uu]})

             }

      
            })
      
    }

    }
}
