const { Client, ContextMenuInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const cap = require("capitalize-first-letter")

module.exports = {
    name: "User Info",
    type: "USER",
    
    /**
     *
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

    
          const member = await interaction.guild.members.cache.get(
            interaction.targetId
          )
 
          var permissions = [];
          var know = "None"
      
          if (member.permissions.has("ADMINISTRATOR")) {
            permissions.push("Administrator");
          }
      
          if (member.permissions.has("MANAGE_ROLES")) {
            permissions.push("Manage Roles");
          }
      
          if (member.permissions.has("MANAGE_CHANNELS")) {
            permissions.push("Manage Channels");
          }
      
          if (member.permissions.has("MANAGE_MESSAGES")) {
            permissions.push("Manage Messages");
          }
      
          if (member.permissions.has("MANAGE_WEBHOOKS")) {
            permissions.push("Manage Webhooks");
          }
      
          if (member.permissions.has("MANAGE_NICKNAMES")) {
            permissions.push("Manage Nicknames");
          }
      
          if (member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            permissions.push("Manage Emojis And Stickers");
          }
      
          if (member.permissions.has("KICK_MEMBERS")) {
            permissions.push("Kick Members");
          }
      
          if (member.permissions.has("BAN_MEMBERS")) {
            permissions.push("Ban Members");
          }
      
          if (member.permissions.has("MENTION_EVERYONE")) {
            permissions.push("Mention Everyone");
          }
      
      
          if (permissions.length == 0) {
            permissions.push("No Key Permissions Found");
          }
      
      
          //---------------------------------------------------------------
      
          if (member.permissions.has("VIEW_AUDIT_LOG")) {
            know = "Server Bot Developer";
          }
      
          if (member.permissions.has("MANAGE_MESSAGES")) {
            know = "Server Trainee Moderator";
          }
      
          if (member.permissions.has("BAN_MEMBERS")) {
            know = "Server Moderator";
          }
      
          if (member.permissions.has("MANAGE_ROLES")) {
            know = "Server Head Moderator";
          }
      
          if (member.permissions.has("ADMINISTRATOR")) {
            know = "Server Admin";
          }
      
      
          if (member.user.id == (await interaction.guild.fetchOwner()).id) {
            know = 'Server Owner';
          }
      
      
          // --------------------------------- 
      
          const flags = member.user.flags?.toArray()
      
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
            .addField("__Server Member Info__", `**Joined:** <t:${~~(member.joinedAt / 1000)}:f> [<t:${~~(member.joinedAt / 1000)}:R>]\n**Booting since:** ${member.premiumSinceTimestamp ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:D>` : 'Not a server booster!'}\n**Nickname:** ${member.displayName === member.user.username ? "No Nickname" : `${member.displayName}`}\n**Highest Role:** ${member.roles.highest.id === interaction.guild.id ? "Doesn't have any role!" : member.roles.highest}\n**Acknowledgements:** ${know}\n\n\n`)
      
            const msg = await interaction.followUp({ embeds: [eyes], components: components(false) })
      
            const collector = msg.createMessageComponentCollector({
              componentType: "BUTTON",
              time: 60000,
          })
    

           collector.on("collect", async (collected) => {
      
            if(collected.customId === "whois") {

              if(collected.user.id !== interaction.user.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })
      
             const moreinfoembed = new MessageEmbed()
             .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
             .setColor("RANDOM")
             .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
             .setTimestamp()
             .addField(`Roles [${Math.floor(member.roles.cache.size - 1)}]`, `${member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== interaction.guild.id).map(role => role.toString()).join(" ") || "Doesn't have any role!"}`, true)
             .addField(`Key Permissions [${permissions.length}]`, `${permissions.join(`, `)}`, false)
      
      
             collected.reply({ embeds: [moreinfoembed], ephemeral: true})
      
            }
      
           })

           collector.on("end", async (i) => { msg.edit({ components: components(true)})})
      
      
          } else {

            const devices = member.presence.clientStatus || {}
      
            const eyes = new MessageEmbed()
              .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
              .setTimestamp()
              .addField("__Account Information__", `**ID:** ${member.user.id}\n**Username:** ${member.user.username} • **Discriminator:** #${member.user.discriminator}\n**Registered:** <t:${Math.floor(member.user.createdAt / 1000)}:f> [<t:${Math.floor(member.user.createdAt / 1000)}:R>]\n**Avatar:** [JPG](${member.user.displayAvatarURL({ format: 'jpg' })}) • [PNG](${member.user.displayAvatarURL({ format: 'png' })}) • [WEBP](${member.user.displayAvatarURL()}) • [GIF](${member.user.displayAvatarURL({ format: 'gif', dynamic: true })})\n**Badges:** ${flags?.length ? `${flags.map(flag => badges[flag]).join(' ')}` : 'No Badges!'}`)
              .addField("__Server Member Info__", `**Joined:** <t:${~~(member.joinedAt / 1000)}:f> [<t:${~~(member.joinedAt / 1000)}:R>]\n**Booting since:** ${member.premiumSinceTimestamp ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:D>` : 'Not a server booster!'}\n**Nickname:** ${member.displayName === member.user.username ? "No Nickname" : `${member.displayName}`}\n**Highest Role:** ${member.roles.highest.id === interaction.guild.id ? "Doesn't have any role!" : member.roles.highest}\n**Acknowledgements:** ${know}\n\n\n`)
              .addField("__Presence Information__", `**Status:** ${cap(member.presence.status)}\n**Devices [${Object.entries(devices).length}]:** ${Object.entries(devices).map((value) => `${value[0][0].toUpperCase()}${value[0].slice(1)}`).join(", ")}`)
      
             const msg = await interaction.followUp({ embeds: [eyes], components: components(false) })
      
                   
            const collector = msg.createMessageComponentCollector({
              componentType: "BUTTON",
              time: 60000,
          })
    
    
          
            collector.on("collect", async (collected) => {
      
             if(collected.customId === "whois") {

              if(collected.user.id !== interaction.user.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })
      
              const moreinfoembed = new MessageEmbed()
              .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
              .setColor("RANDOM")
              .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true })}`)
              .setTimestamp()
              .addField(`Roles [${Math.floor(member.roles.cache.size - 1)}]`, `${member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== interaction.guild.id).map(role => role.toString()).join(" ") || "Doesn't have any role!"}`, true)
              .addField(`Key Permissions [${permissions.length}]`, `${permissions.join(`, `)}`, false)
      
      
              collected.reply({ embeds: [moreinfoembed], ephemeral: true})
      
             }
      
            })

            collector.on("end", async (i) => { msg.edit({ components: components(true)})})
      
      
          }
}
}