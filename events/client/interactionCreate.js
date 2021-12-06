const client = require("../../index");
const { Client, Collection, MessageEmbed, WebhookClient } = require("discord.js");
const Timeout = new Collection();
const ms = require("ms")

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {

    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply({ content: "An error has occured " });

    let args = [];

    var devonly = new MessageEmbed().setDescription(`Only developers for ${client.user.username} can use this command!`).setColor(`${client.embedColor.moderationRed}`)

    if (cmd.developerOnly && !client.config.developers.includes(interaction.user.id)) return interaction.reply({ embeds: [devonly], ephemeral: true })

    if (cmd.botCommandOnly === true && !interaction.channel.name.includes("command") && !interaction.member?.permissions?.has("ADMINISTRATOR")) {

      var botcmd = new MessageEmbed().setDescription('You may only use this command in bot command channels!').setColor(`${client.embedColor.moderationRed}`)
      interaction.reply({ embeds: [botcmd], ephemeral: true })

    } else {

      if (cmd.cooldown && !interaction.member?.permissions?.has("ADMINISTRATOR")) {

        let lek = `${~~(Timeout.get(`${cmd.name}${interaction.user.id}`) - Date.now())}`
        let cooldownembed = new MessageEmbed().setColor(`${client.embedColor.noColor}`).setDescription(`You need to wait \`${ms(parseInt(lek), { long: true })}\` to use this slash command again.`)
        if (Timeout.has(`${cmd.name}${interaction.member.user.id}`))
          return interaction.reply({ embeds: [cooldownembed], ephemeral: true })

        await interaction.deferReply({ ephemeral: false || cmd.ephemeral })

        cmd.run(client, interaction, args);
        Timeout.set(
          `${cmd.name}${interaction.member.user.id}`,
          Date.now() + cmd.cooldown
        );
        setTimeout(() => {
          Timeout.delete(`${cmd.name}${interaction.member.user.id}`);
        }, cmd.cooldown);

      } else {

        await interaction.deferReply({ ephemeral: false || cmd.ephemeral })

        for (let option of interaction.options.data) {
          if (option.type === "SUB_COMMAND") {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
              if (x.value) args.push(x.value);
            });
          } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(
          interaction.user.id
        );


        cmd.run(client, interaction, args);
      }

    }

  }


  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});