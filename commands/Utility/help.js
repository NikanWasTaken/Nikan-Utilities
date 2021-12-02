const cap = require("capitalize-first-letter")
const { MessageEmbed, Client, MessageActionRow, MessageSelectMenu, Message } = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix
const ms = require("ms");
const { readdirSync } = require("fs")

module.exports = {
  name: "help",
  description: "Help menu",
  cooldown: 5000,
  usage: `<command name>`,
  botCommandOnly: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {



    if (!args.length) {

      const emojis = {
        developers: "<:EARLY_VERIFIED_BOT_DEVELOPER:899171458444578836>",
        information: "<:orangeinfo:883063843817934893> ",
        utility: "<:NUnode:894097855269208085>",
        moderation: "<:DISCORD_EMPLOYEE:899171458050306058> ",
        events: "<a:SR_giveaways:897844189096722532>",
        server: "<a:NUdiscord:914784249012424734>"
      }

      const directories = [
        ...new Set(client.commands.filter(e => e.directory != "Secret").map((cmd) => cmd.directory))
      ];

      const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

      const categories = directories.map((dir) => {
        const getCommands = client.commands.filter(
          (cmd) => cmd.directory === dir &&
            cmd.secret !== true
        ).map(cmd => {
          return {
            name: cmd.name || "No Name ❌",
            description: cmd.description || "No description",
          };
        })
        return {
          directory: formatString(dir),
          commands: getCommands,
        };

      });

      let cata = [];

      readdirSync("./commands/").filter((fi) => fi !== "Secret").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: cap(dir),
          value: cmds.length === 0 ? "This Category is in progress..." : cmds.join(" "),
        };

        cata.push(data);
      });


      let mainembed = new MessageEmbed()
        .setTitle(`${client.user.username} Help menu`)
        .setDescription("Please select a category from the dropdown!")
        .addFields(cata)
        .setColor("BLUE")
        .setFooter(`You only have 1 minute to use this help menu.`)
        .setTimestamp();

      const components = (state) => [
        new MessageActionRow().addComponents(
          new MessageSelectMenu().setCustomId('help-menu').setPlaceholder("Please select a category")
            .setDisabled(state)
            .addOptions(categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands from ${cmd.directory} category`,
                emoji: emojis[cmd.directory.toLowerCase()] || null,
              }
            })
            )
        ),
      ];

      const initialMessage = await message.reply({
        embeds: [mainembed],
        components: components(false)
      });


      const collector = initialMessage.createMessageComponentCollector({
        componentType: "SELECT_MENU",
        time: 60000,
      });

      collector.on('collect', (interaction) => {
        const [directory] = interaction.values;
        const category = categories.find(x => x.directory.toLowerCase() === directory
        );

        let embednew = new MessageEmbed()
          .setTitle(`${cap(directory)} commands`)
          .setDescription(`Here are the list of commands\n\n${category.commands.filter((c) => !c.secret).map((cmd, i) => {

            return [
              `${i + 1}. \`${client.config.prefix}${cmd.name}\` • ${cmd.description}`
            ]

          }).join("\n")
            }`)
          .setColor("BLUE")
        interaction.reply({ embeds: [embednew], ephemeral: true })
      });


      collector.on('end', () => {
        initialMessage.edit({ components: components(true) })
      })

    } else {

      const command =
        client.commands.filter(c => c.category !== "Secret").get(args[0].toLowerCase()) ||
        client.commands.filter(c => c.category !== "Secret").find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));
      if (!command) {
        const emb2 = new MessageEmbed()
          .setDescription(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
          .setColor(`${client.embedColor.failed}`);
        return message.reply({
          embeds: [emb2]
        });
      }

      const emb3 = new MessageEmbed()
        .setAuthor(`${cap(command.name)} Command`, client.user.displayAvatarURL())
        .setDescription(`> **Name:** ${command.name ? cap(command.name) : 'No name'}\n> **Category:** ${command.category ? cap(command.category) : "No Category"}\n> **Description:** ${command.description ? command.description : "No description"}\n> **Usage:** ${command.usage ? `\`${config.prefix + command.name + ` ${command.usage}`}\`` : "No Usage found!"}\n> **Aliases:** ${command.aliases ? `\`${command.aliases.join("` `")}\`` : "No Aliases Available"}\n> **Cooldown:** ${command.cooldown ? ms(command.cooldown, { long: true }) : "No Cooldown"}`)
        .setColor("BLURPLE")
        .setFooter(`Syntax: "[] = required", "<> = optional"`)
        .setTimestamp()
      message.reply({
        embeds: [emb3]
      })
    }


  },
};