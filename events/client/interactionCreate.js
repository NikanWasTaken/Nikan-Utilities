const client = require("../../index");
const { Collection, MessageEmbed } = require("discord.js");
const Timeout = new Collection();

const noPermissions = new MessageEmbed()
  .setDescription("You don't have permissions to run this command.")
  .setColor(`${client.color.moderationRed}`)

const botCommand = new MessageEmbed()
  .setDescription('You may only use this command in bot command channels!')
  .setColor(`${client.color.moderationRed}`)

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    let args = [];

    // command check
    if (!cmd) return interaction.reply({ content: "An error has occured " });


    // developer commands check
    if (
      cmd.developer &&
      !client.config.developers.includes(interaction.user.id)
    ) return interaction.reply({ embeds: [noPermissions], ephemeral: true })


    // bot command check
    if (
      cmd.botCommand === true &&
      !interaction.channel.name.includes("command") &&
      !interaction.member?.permissions?.has("ADMINISTRATOR") &&
      !client.config.developers.includes(interaction?.user?.id) &&
      interaction.user.id !== client.config.owner
    ) return interaction.reply({ embeds: [botCommand], ephemeral: true })


    if (
      cmd.cooldown &&
      !interaction.member?.permissions?.has("ADMINISTRATOR") &&
      interaction.user.id !== client.config.owner
    ) {

      let cooldownRemaining = `${~~(Timeout.get(`${cmd.name}${interaction.user.id}`) - Date.now())}`

      let cooldownEmbed = new MessageEmbed()
        .setColor(`${client.color.invisible}`)
        .setDescription(`You need to wait \`${client.convert.time(parseInt(~~(cooldownRemaining / 1000)))}\` to use this command again.`);

      if (Timeout.has(`${cmd.name}${interaction.member.user.id}`))
        return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true })

      await interaction.deferReply({ ephemeral: false || cmd.ephemeral })

      cmd.run({ client, interaction, args });
      Timeout.set(
        `${cmd.name}${interaction.member.user.id}`,
        Date.now() + cmd.cooldown
      );
      setTimeout(() => {
        Timeout.delete(`${cmd.name}${interaction.member.user.id}`);
      }, cmd.cooldown);

    } else {

      // deffering the reply
      await interaction.deferReply({ ephemeral: false || cmd.ephemeral })

      // installing the sub commands
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


      cmd.run({ client, interaction, args });

    }


  }


  // Context Menu Handling
  if (interaction.isContextMenu()) {
    const command = client.slashCommands.get(interaction.commandName);
    await interaction.deferReply({ ephemeral: false || command.ephemeral });
    if (command) command.run({ client, interaction });
  }
});