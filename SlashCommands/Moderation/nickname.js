const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const randomnick = require("randomstring")


module.exports = {
    name: "nickname",
    description : 'Manages the nickname of an user in some ways!',
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
          name: "edit",
          description: "Edits the nickname of a member!",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user you want to change their nickname!",
              type: "USER",
              required: true
            },
            {
              name: "nickname",
              description: "The nickname you want to change thir nickname to!",
              type: "STRING",
              required: true
            }
          ]

        },
        {
          name: "reset",
          description: "Resets the nickname for a member!",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user you want to reset thir nickname!",
              type: "USER",
              required: true
            }
          ]

        },
        {
          name: "moderate",
          description: "Moderates the nickname for an user!",
          type: "SUB_COMMAND",
          options: [
            {
              name: "user",
              description: "The user you want to moderated thir nickname!",
              type: "USER",
              required: true
            }
          ]

        },
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, modlog) => {

      const subs = interaction.options.getSubcommand(["edit", "reset", "moderate"])

      if(subs == "edit") {
  
        const user = interaction.options.getMember("user")
        const name = interaction.options.getString("nickname")

        let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't do that!`).setColor(`${client.embedColor.failed}`)
        let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't do that as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
        if(user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot]})
        if(user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })
  
      let nochnaeg = new MessageEmbed().setColor(`${client.embedColor.failed}`).setDescription(`${client.botEmoji.failed} Nothing changed as you provided their current nickname.`)
      if(name == user.displayName) return interaction.followUp({ embeds: [nochnaeg]})
   
  
      let chnaged = new MessageEmbed().setDescription(`Changed ${user.user.username} nickname to \`${name}\``).setColor(`${client.embedColor.moderation}`)
      interaction.followUp({ embeds: [chnaged] })
      user.setNickname(`${name}`)
  
      let log2 = new MessageEmbed()
      .setAuthor(`Action: Change Nickname`, interaction.guild.iconURL({ dynamic: true }))
      .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
      .setColor(`${client.embedColor.logAqua}`)
      .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
      .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
      .addField("● Nickname Info", `> New Nickname: ${name}`)
      .setTimestamp()
      modlog.send({ embeds: [log2]})

      } else if(subs == "reset") {

        const user = interaction.options.getMember("user")

        if(user.user.username !== user.displayName) {

          let xxperm = new MessageEmbed().setDescription(`${client.botEmoji.failed} Unable to reset nickname for that user.`).setColor(`${client.embedColor.failed}`)
          if(user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxperm]})
  
        let log = new MessageEmbed()
        .setAuthor(`Action: Resets Nickname`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
        .setColor(`${client.embedColor.logAqua}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
        .addField("● Nickname Info", `> New Nickname: Nickname resets | ${user.user.username}`)
        .setTimestamp()
    
        let rest = new MessageEmbed().setDescription(`Reseted the nickname for ${user.user.tag}.`).setColor(`${client.embedColor.moderation}`)
        interaction.followUp({ embeds: [rest]})
        user.setNickname(user.user.username)
        modlog.send({ embeds: [log]})
  
  
        } else {
          interaction.followUp("They don't already have a nickname to reset it!")
        }

      } else if(subs == "moderate") {

        const user = interaction.options.getMember("user")

        const nicknamegen = randomnick.generate({
            length: 4,
            charset: "alphanumeric"
        });
        const nickname = `Moderated Nickname ${nicknamegen}`

        let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't do that!`).setColor(`${client.embedColor.failed}`)
        let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't do that as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
        if(user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot]})
        if(user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })

        if(!user.displayName.startsWith("Moderated Nickname")) {

        let done = new MessageEmbed().setDescription(`${client.botEmoji.success} Moderated The Nickname to \`${nickname}\`!`).setColor(`${client.embedColor.success}`)
        interaction.followUp({ embeds: [done]})
        user.setNickname(nickname)

        let log2 = new MessageEmbed()
        .setAuthor(`Action: Moderate Nickname`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
        .addField("● Nickname Info", `> New Nickname: ${nickname}`)
        .setTimestamp()
        modlog.send({ embeds: [log2]})

        } else return interaction.followUp("This user already has a moderated nickname.")

      }


    }
}