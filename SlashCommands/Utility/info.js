const { Client, CommandInteraction, interaction, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const moment = require("moment")
const weather = require("weather-js");
const fetch = require("node-fetch")
const cap = require("capitalize-first-letter")

module.exports = {
    name: "info",
    description : `Checks the information about a channel.`,
    cooldown: 5000,
    botCommandOnly: true,
    options: [
        {
          name: "channel",
          description: "Information about a channel!",
          type: "SUB_COMMAND",
          options: [
            {
              name: 'channel',
              description: 'The channel you want to get information about it!',
              type: 'CHANNEL',
              required: true,
            }
          ]
        },
        {
          name: "role",
          description: "Information about a role!",
          type: "SUB_COMMAND",
          options: [
            {
              name: 'role',
              description: 'The role you want to get information about!',
              type: 'ROLE',
              required: true,
            }
          ]
        },
        {
          name: "server",
          description: "Information about the server!",
          type: "SUB_COMMAND",
        },
        {
          name: "user",
          description: "Information about a user!",
          type: "SUB_COMMAND",
          options: [
            {
              name: 'member',
              description: 'The user you want to get information about!',
              type: 'USER',
              required: false,
            }
          ]

        },
        {
          name: "weather",
          description: "Information about the weather of a city!",
          type: "SUB_COMMAND",
          options: [
            {
              name: 'location',
              description: 'The city you want to get information about!',
              type: 'STRING',
              required: true,
            }
          ]

        },
        {
          name: "color",
          description: "Information about a color!",
          type: "SUB_COMMAND",
          options: [
            {
              name: 'hex-code',
              description: 'Hex code of the color you want to get information about!',
              type: 'STRING',
              required: true,
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
    run: async (client, interaction, args) => {


            let subs = interaction.options.getSubcommand(["channel", "role", "server", "user", "weather", "color"]);

            if(subs == "channel") {

              let channel = interaction.options.getChannel("channel")
 

            let types = []
            if(channel.type === "GUILD_TEXT")  types.push("Text channel")
            if(channel.type === "GUILD_VOICE") types.push("Voice channel")
            if(channel.type === "GUILD_CATEGORY") types.push("Category")
            if(channel.type === "GUILD_NEWS") types.push("Announcement channel")
            if(channel.type === "GUILD_STAGE_VOICE") types.push("Stage channel")
            if(channel.type === "GUILD_PUBLIC_THREAD") types.push("Public Thread")
            if(channel.type === "GUILD_PRIVATE_THREAD") types.push("Private Thread")
            if(channel.type === "GUILD_STAGE_VOICE") types.push("Stage channel")
    
            let channelembed = new MessageEmbed()
                .setAuthor(`Information for ${channel.name}`, interaction.guild.iconURL({ dynamic: true }))
                .addField("Name", `${channel}`, true)
                .addField("ID", channel.id, true)
                .addField("Description", `${channel.topic || "No Description"}`)
                .addField("Additional Information", `> Nsfw: ${channel.nsfw ? "✅" : "❌"}\n> Type: ${types.join(", ")}`, false)
                .addField("Created At", `${moment(channel.createdTimestamp).format("LT")} ${moment(channel.createdTimestamp).format("LL")} (${moment(channel.createdTimestamp).fromNow()})`, false)
                .setColor("RANDOM")
            interaction.followUp({ embeds: [channelembed]})

            } else if(subs === "role") {


              let permissions = [];
              const role = interaction.options.getRole("role")
          
              if(role.permissions.has("ADMINISTRATOR")){ permissions.push("Administrator") }
              if(role.permissions.has("MANAGE_ROLES")){ permissions.push("Manage Roles") }
              if(role.permissions.has("MANAGE_CHANNELS")){ permissions.push("Manage Channels") }
              if(role.permissions.has("MANAGE_MESSAGES")){ permissions.push("Manage interactions") }
              if(role.permissions.has("MANAGE_WEBHOOKS")){ permissions.push("Manage Webhooks")} 
              if(role.permissions.has("MANAGE_NICKNAMES")){ permissions.push("Manage Nicknames") }
              if(role.permissions.has("MANAGE_EMOJIS_AND_STICKERS")){ permissions.push("Manage Emojis And Stickers") }
              if(role.permissions.has("KICK_MEMBERS")){ permissions.push("Kick Members") }
              if(role.permissions.has("BAN_MEMBERS")){ permissions.push("Ban Members") }
              if(role.permissions.has("MENTION_EVERYONE")){ permissions.push("Mention Everyone") }
          
          
              if(permissions.length == 0){
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
              
              const position = `\`${
                interaction.guild.roles.cache.size - role.position
              }\`/\`${interaction.guild.roles.cache.size}\``;
          
              const embed = new MessageEmbed()
                .setTimestamp()
                .setAuthor(role.name, interaction.guild.iconURL({ dynamic: true }))
                .setColor(role.color)
                .setFooter(`Role ID: ${role.id}`)
                .setDescription(`**● ${role.members.size}** people in this server have this role!`)
                .addField("Color", role.hexColor, true)
                .addField('Position', position, true)
                .addField("Creation Date",`\`${moment(role.createdAt).format("DD/MM/YYYY")}\``, true)
                .addField("● Advanced Info", `> Hoisted: ${role.hoist ? "✅" : "❌"}\n> Mentionable: ${role.mentionable ? "✅" : "❌"}\n> Bot Role: ${role.managed ? "✅" : "❌"}`, false)
                .addField("● Key Permissions", permissions.join(", "), false)
          
          
              const msg = await interaction.followUp({ embeds: [embed], components: components(false) });

                      
              const collector = msg.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 60000,
            })
          
          
            
              collector.on("collect", async (collected) => {

                if(collected.customId === "roleinfo") {

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
                  "MANAGE_EMOJIS": "Manage Emojis",
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
        
              if(collected.user.id !== interaction.user.id) return collected.reply({ content: "This menu is not for you!", ephemeral: true })
        
                const e = new MessageEmbed()
                .setTimestamp()
                .setAuthor(role.name, interaction.guild.iconURL({ dynamic: true }))
                .setColor(role.color)
                .setDescription(`These are all the permissions for the ${role} role. `)
                .addField("Full Permission List", `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
        
        
                collected.reply({ embeds: [e], ephemeral: true })

            }
        
              })

              collector.on("end", async (collected) => { msg.edit({ components: components(true)})})
        
        
              // -----
              
            } else if(subs == "server") {

              const voiceChannel = interaction.guild.channels.cache.filter((ch) => ch.type === "GUILD_VOICE").size;
              const textChannel = interaction.guild.channels.cache.filter((ch) => ch.type === "GUILD_TEXT").size;
              const humans = interaction.guild.members.cache.filter((m) => !m.user.bot).size;
              const bots = interaction.guild.members.cache.filter((m) => m.user.bot).size;
              const humanbot = interaction.guild.memberCount;
  
              const embed = new MessageEmbed()
                  .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                  .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                  .setColor("BLURPLE")
                  .setTimestamp()
                  .addField("General Information", `**Name** • ${interaction.guild.name}\n**Server ID** • ${interaction.guildId}\n**Owner** • ${(await interaction.guild.fetchOwner())}\n**Region** • Not available anymore!\n**Verification Level** • ${interaction.guild.verificationLevel.toString()}`, true)
                  .addField("Counts", `Channels: ${interaction.guild.channels.cache.size} • #️⃣ ${textChannel} & 🔈 • ${voiceChannel}\nRoles • ${interaction.guild.roles.cache.size}\nMembers: ${humanbot} • Humans: ${humans} • Bots: ${bots}\nEmojis: ${interaction.guild.emojis.cache.size} `, false)
                  .addField("Boosts Information", `Booster Role • ${await (interaction.guild.roles.premiumSubscriberRole)}\nBoosts Count • ${interaction.guild.premiumSubscriptionCount}\nBoost Level • ${interaction.guild.premiumTier.toString()}`, false)
                  .addField("Creation Date", `${moment(interaction.guild.createdTimestamp).format("LT")} ${moment(
                      interaction.guild.createdTimestamp
                  ).format("LL")} (${moment(interaction.guild.createdTimestamp).fromNow()})`)
  
  
              interaction.followUp({ embeds: [embed] })

            } else if(subs === "user") {


              var permissions = [];
              var know = "None"
              let member = interaction.options.getMember("member") || interaction.member;
          
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
              ];
          
          
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

               collector.on("end", async (collected) => { msg.edit({ components: components(true)})})
          
          
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

                collector.on("end", async (collected) => { msg.edit({ components: components(true)})})
          
          
              }
          
        
            } else if(subs == "weather") {

              let input = interaction.options.getString("location")
              weather.find({ search: input, degreeType: 'C' }, function(error, result) {
              if (error) return interaction.followUp(`Something Went Wrong, Try Again Later!`)
             
              if (result === undefined || result.length === 0)
              return interaction.followUp(
              `Invalid location, please give a valid location!`)
             
              var current = result[0].current;
              var location = result[0].location;
             
              const Weather = new MessageEmbed()
              .setColor("#e6cc93")
              .setTitle(`${location.name} Weather!`)
              .setDescription(`Temperature units can may be differ some time`)
              .setThumbnail(current.imageUrl)
              .addField("Sky Mod", current.skytext, true)
              .addField("Temperature", `${current.temperature}° Celcius`, true)
              .addField("Humidity", `${current.humidity}%`, true)
              .addField("Wind Speed", current.windspeed, true)
              .addField("Wind Desplay", current.winddisplay, true)
              .addField("Feels Like", `${current.feelslike}° Celcius`, true)
              .addField("Timezone", `UTC${location.timezone}`, true)
              .setTimestamp();
             
              interaction.followUp({ embeds: [Weather]})
             
              });

            } else if(subs == "color") {

              var color = interaction.options.getString("hex-code")
              if (color.includes("#")) {
                  color = interaction.options.getString("hex-code").split("#")[1]
              }
              const url = (`https://api.alexflipnote.dev/colour/${color}`)
              let json
              try {
  
                  json = await fetch(url).then(res => res.json())
              }
              catch (e) {
                  return interaction.followUp('An Error Occured, Try Again Later.')
              }
  
              if (json.description) return interaction.followUp("Invalid hex code!")
              let embed = new MessageEmbed()
                  .setTitle(json.name)
                  .addField("RGB", json.rgb || "Not found!", true)
                  .addField("Brightness", json.brightness ? "Not Found!" : json.brightness, true)
                  .addField("Hex", json.hex || "Not Found!", true)
                  .setThumbnail(json.image)
                  .setImage(json.image_gradient, true)
                  .setColor(json.hex)
              interaction.followUp({ embeds: [embed] })
              
            }

    }
}