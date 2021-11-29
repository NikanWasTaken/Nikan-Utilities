const { Client, CommandInteraction, Message, MessageEmbed } = require("discord.js");



module.exports = {
    name: "lockdown",
    description : `Takes an action on every channel!`,
    userPermissions: ["BAN_MEMBERS"],
    cooldown: 5000,
    options: [
          {
            name: "action",
            description: "The action you want to take!",
            required: true,
            type: "STRING",
            choices: [
              {
                name: "start",
                value: "start",
                description: "Starts the lockdown and locks all the channels in the guild!"
              },
              {
                name: "end",
                value: "end",
                description: "Ends the lockdown and inlocks all the channels in the guild!"
              }
            ]

  
          },
          {
            name: "reason",
            description: "The reason of your lockdown!",
            required: true,
            type: "STRING",
          }
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, modlog) => {

        const action = interaction.options.getString("action")
        var reason = interaction.options.getString("reason")

        if(action == "start") {

          let msg = await interaction.followUp({ content: "Locking the server..." })

            interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").forEach(ch => {
              ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false
              })
            })
  
            interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").forEach(ch => {
              ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                CONNECT: false
              })
            })
  
            var hii = new MessageEmbed()
            .setAuthor("Server Locked", client.user.displayAvatarURL( { dynamic:true } ))
            .setDescription("This server has been locked by a staff member. You are not muted.\nMore information will be sent here eventually.")
            .setColor(`${client.embedColor.moderation}`)
            .setTimestamp()
            .addFields({
              name: "Reason",
              value: reason
            })
         
            interaction.guild.channels.cache.get("782837655082631229").send({ embeds: [hii]})

            await msg.edit({ content: "Server Locked!" })

  
          let log = new MessageEmbed()
          .setAuthor(`Action: Server Lock`, interaction.guild.iconURL({ dynamic: true }))
          .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
          .setColor(`${client.embedColor.logAqua}`)
          .addField('Channel Info', `● ${interaction.guild.name}\n> All the channnels\n> Lockdown`, true)
          .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
          .addField("● Lockdown Info", `> Reason: ${reason}`)
          .setTimestamp()
          modlog.send({ embeds: [log]})

        } else if(action == "end") {

          let msg = await interaction.followUp({ content: "Unlocking the server..." })

          interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").forEach(ch => {
            ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
              SEND_MESSAGES: null
            })
          })
      
          interaction.guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").forEach(ch => {
            ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {
              CONNECT: null
            })
          })
      
          var hii = new MessageEmbed()
            .setAuthor("Server Unlocked", client.user.displayAvatarURL({ dynamic: true }))
            .setDescription("This server has been unlocked by a staff member.\nYou may start chatting now!")
            .setColor(`${client.embedColor.moderation}`)
            .setTimestamp()
      
          interaction.guild.channels.cache.get("782837655082631229").send({ embeds: [hii] })

          await msg.edit({ content: "Server unlocked!" })
      
          let log = new MessageEmbed()
            .setAuthor(`Action: Server Unlock`, interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
            .setColor(`${client.embedColor.logGreen}`)
            .addField('Channel Info', `● ${interaction.guild.name}\n> All the channnels\n> Lockdown ended`, true)
            .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
            .setTimestamp()
          modlog.send({ embeds: [log] })

        }

    }
}