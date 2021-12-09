const cap = require("capitalize-first-letter")
const { MessageEmbed, Client, MessageActionRow, MessageSelectMenu, Message, MessageButton } = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix
const ms = require("ms");
const { readdirSync } = require("fs")

module.exports = {
  name: "help",
  description: "You got this!",
  cooldown: 5000,
  category: "utility",
  usage: `<command name>`,
  botCommandOnly: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    // return message.reply("This command is currently in progress! come back later!")


    if (!args.length) {


      let moderation = client.commands.filter(c => c.category === "moderation" && c.visible !== false)
      let other = client.commands.filter(c => c.category !== "moderation" && c.visible !== false && c.category !== "Secret" && c.category !== "Events")
      let mainembed = new MessageEmbed()
        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
        .setDescription(`[** Vote for ${client.guilds.cache.get(client.server.id).name}**](https://top.gg/servers/${client.server.id}) • [**Subreddit**](https://www.reddit.com/r/NikanWorld/) `)
        .addField(`**Moderation [${moderation.size}]**`, `${moderation.map(c => `\`${c.name}\``).join(" • ")}`)
        .addField(`**Other [${other.size}]**`, `${other.map(c => `\`${c.name}\``).join(" • ")}`)
        .setColor(`${client.color.botBlue}`)


      const components = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('help')
          .setPlaceholder("Please select an option!")
          .addOptions(
            [
              {
                label: "Moderation",
                value: "moderation",
                description: "Everything about moderation!",
                emoji: "<:DISCORD_EMPLOYEE:899171458050306058>"
              },
              {
                label: "Events",
                value: "events",
                description: "Everything about event commands!",
                emoji: "<a:SR_giveaways:897844189096722532>"
              },
              {
                label: "Others",
                value: "other",
                description: "Commands accessable by everyone!",
                emoji: "<a:NUdiscord:914784249012424734>"
              }
            ]
          )
      )


      const ended = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('help')
          .setPlaceholder("Timed Out!")
          .setDisabled(true)
          .addOptions(
            [
              {
                label: "Moderation",
                value: "moderation",
                description: "Everything about moderation!",
                emoji: "<:DISCORD_EMPLOYEE:899171458050306058>"
              },
              {
                label: "Events",
                value: "events",
                description: "Everything about event commands!",
                emoji: "<a:SR_giveaways:897844189096722532>"
              },
              {
                label: "Others",
                value: "other",
                description: "Commands accessable by everyone!",
                emoji: "<a:NUdiscord:914784249012424734>"
              }
            ]
          )
      )

      const initialMessage = await message.reply({
        embeds: [mainembed],
        components: [components]
      });


      const collector = initialMessage.createMessageComponentCollector({
        componentType: "SELECT_MENU",
        time: 30000,
      });

      collector.on('collect', (collected) => {


        if (collected.customId === "help") {

          if (collected.values[0] === "moderation") {

            if (collected.user.id !== message.author.id) return collected.reply({ content: "This is not menu!", ephemeral: true })

            const no = new MessageEmbed()
              .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
              .setDescription("The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [Beep] A single lap should be completed each time you hear this sound. Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over.")
              .addField("** **", "Well, nice wasting your time reading that. Whoops, I forgot to say you need staff to see this page!")
              .setTimestamp()
              .setColor("RED")
            if (!message.member.permissions.has("MANAGE_MESSAGES")) return collected.reply({ embeds: [no], ephemeral: true })

            const embed = new MessageEmbed()
              .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
              .setColor(`${client.color.moderation}`)
              .setTitle("Moderation Guide™️").setURL(`https://discord.com/channels/${client.server.id}/881803011503058944`)
              .setDescription(`Hey dear moderator, this page is made for you to learn more about me! We've made alot of channels for you to understand everything about me! Now it's my turn to tell you somethings!\nFirst of all, let's start with my commands, these are all of my commands, you need to learn to use them correctly as a staff member!`)
              .addField("My Commands", `${moderation.map(c => `\`${client.config.prefix}${c.name}\``).join(" • ")}\n\nWoah Woah wait a sec, I have some secret commands for you too!\n${client.commands.filter(c => c.category === "Secret").map(c => `\`${client.config.prefix}${c.name}\``).join(" • ")}\n\nI don't even know what these do, maybe try them yourself or ask other moderators?\nMake sure to check all of my commands [**here**](https://discord.com/channels/${client.server.id}/881803011503058944) with their full information!`, true)
              .addField("Moderation", `Well, the next thing I want to talk about is how to moderate and [rules](https://discord.com/channels/${client.server.id}/882245740221591563) for it!\nI can't describe and tell you all of them here because of my laziness, but, Nikan has written them down [**here**](https://discord.com/channels/${client.server.id}/882245740221591563) for you!`)
              .addField("Your duties", `Exactly like the rules, I'm too lazy to write your responsibilities here, but thanks to Nikan for writing them, I can just give you a link to them!\nJust check them out [**here**](https://discord.com/channels/${client.server.id}/882718002162839582)`)
              .addField("Other useful channels", `These channels are useful for you as a moderator too! Make sure to check them out at the staff category channels!`)
              .setFooter(`Moderation Guide™️`)
              .setTimestamp()

            collected.reply({ embeds: [embed], ephemeral: true })


          } else if (collected.values[0] === "events") {

            if (collected.user.id !== message.author.id) return collected.reply({ content: "This is not menu!", ephemeral: true })

            const no = new MessageEmbed()
              .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
              .setDescription("The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [Beep] A single lap should be completed each time you hear this sound. Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over.")
              .addField("** **", "Well, nice wasting your time reading that. Whoops, I guess I forgot to say only event hosts can see this page!")
              .setTimestamp()
              .setColor("RED")

            if (!message.member.roles.cache.get("880409157969256518")) return collected.reply({ embeds: [no], ephemeral: true })

            const embed = new MessageEmbed()
              .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
              .setColor(`#deba04`)
              .setTitle("Events™️").setURL(`https://discord.com/channels/${client.server.id}/904601285985185792`)
              .setDescription(`Hello dear event host! You are a huge part of this server as you host many events in the server! I wanted to show you alot of my feature that we've made for you!`)
              .addField("Guide", `Let me start with the guide! I dont need to talk about these alot because Nikan has already written them down for ya!\nJust check them out [**here**](https://discord.com/channels/${client.server.id}/904601285985185792)`)
              .addField("Commands", `It's time for me to show you all of my commands that will be useful for you while hosting events!\n\n${client.commands.filter(c => c.category === "Events").map((c) => {
                return [`> ➜ **${client.config.prefix}${c.name}** : ${c.description}`]
              }).join("\n")}`)

            collected.reply({ embeds: [embed], ephemeral: true })

          } else if (collected.values[0] === "other") {

            if (collected.user.id !== message.author.id) return collected.reply({ content: "This is not menu!", ephemeral: true })

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel("Vote")
                .setURL(`https://top.gg/servers/${client.server.id}/vote`)
                .setStyle("LINK"),

              new MessageButton()
                .setLabel("Subreddit")
                .setURL("https://www.reddit.com/r/NikanWorld/")
                .setStyle("LINK")
            )

            const embed = new MessageEmbed()
              .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
              .setTitle("My Commands").setURL(`${client.server.invite}`)
              .setDescription("Wow, I see we're finally here! The commands accessable by everyone in this server?\nWait, let me show you all the commands that I haven't showed you!")
              .addField("Server Commands", `${client.commands.filter(c => c.visible !== false && c.category === "server").map(c => `\`${c.name}\``).join(" • ")}`)
              .addField("Utility Commands", `${client.commands.filter(c => c.visible !== false && c.category === "utility").map(c => `\`${c.name}\``).join(" • ")}`)
              .setColor(`RANDOM`)

            collected.reply({ embeds: [embed], ephemeral: true, components: [row] })


          }
        }

      });

      collector.on('end', () => {

        initialMessage.edit({ components: [ended] })

      })

    } else {

      const command =
        client.commands.filter(c => c.visible !== false).get(args[0].toLowerCase()) ||
        client.commands.filter(c => c.visible !== false).find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

      if (!command) {
        const emb2 = new MessageEmbed()
          .setDescription(`Command not found!`)
          .setColor("RED");

        return message.reply({
          embeds: [emb2]
        }).then((msg) => {
          setTimeout(() => {
            msg?.delete()
            message?.delete()
          }, 5000)
        })

      }

      const emb3 = new MessageEmbed()
        .setAuthor(`${cap(command.name)} Command`, client.user.displayAvatarURL())
        .setDescription(`> **Name:** ${command.name ? cap(command.name) : 'No name'}\n> **Category:** ${command.category ? cap(command.category) : "No Category"}\n> **Description:** ${command.description ? command.description : "No description"}\n> **Usage:** ${command.usage ? `\`${config.prefix + command.name + ` ${command.usage}`}\`` : "No Usage found!"}\n> **Aliases:** ${command.aliases ? `\`${command.aliases.join("` `")}\`` : "No Aliases Available"}\n> **Cooldown:** ${command.cooldown ? ms(command.cooldown, { long: true }) : "No Cooldown"}`)
        .setColor(`${client.color.botBlue}`)
        .setFooter(`Syntax: "[] = required", "<> = optional"`)
      message.reply({
        embeds: [emb3]
      })
    }


  },
};