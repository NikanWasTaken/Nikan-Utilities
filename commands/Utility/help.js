const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;

module.exports = {
  name: "help",

  run: async (client, message, args) => {

    let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

    if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {

    if (!args[0]) {
      let categories = [];

      readdirSync("./commands/").forEach((dir) => {
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
          name: dir,
          value: cmds.length === 0 ? "This Category is in progress..." : cmds.join(" "),
        };

        categories.push(data);
      });

      const embed = new MessageEmbed()
        .setTitle(`${client.user.username} Commands`)
        .setThumbnail(client.user.displayAvatarURL( { dynamic: true } ))
        .addFields(categories)
        .setDescription(
          `${client.user.username} prefix is \`${prefix}\`.\nFor more info on a specific command, run \`${prefix}help <command>.\``
        )
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor("#285DE3");
      return message.channel.send(embed);
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new MessageEmbed()
          .setDescription(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
          .setColor("FF0000");
        return message.channel.send(embed);
      }

      const embed = new MessageEmbed()
        .setAuthor(`${command.name} command`, client.user.displayAvatarURL( { dynamic: true } ))
        .addField(
          "Description",
          command.description
            ? command.description
            : "No description for this command."
        )
        .addField(
          "Aliaces",
          command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "No aliases for this command."
        )
        .addField(
          "Required Permissions / Channels",
          command.usage || "No Requirements"
        )
        .setColor("#285DE3");
      return message.channel.send(embed);
    }
  } else 
  message.channel.send(botcmd).then((m) => m.delete( {timeout: 5000})).then(message.delete())
  },
};
