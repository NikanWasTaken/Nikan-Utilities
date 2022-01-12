const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require("../../index.js")

const add = client.emoji.success;
const remove = client.emoji.fail;

const giveaways = '831754757932580895';
const events = '880401182131114024';
const polls = '833174349732642836';
const fotd = '887285307668561930';
const announcement = '897836245760237588';

const him = '897829275066040351';
const her = '897829279793045514';
const they = '897829282443845632';
const ask = '897829538594185276';

const roleorg = '868378820120547378';

const arrayofroles = [giveaways, events, polls, fotd, announcement, him, her, they, ask];


client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {

    const member = interaction.member.roles;

    switch (interaction.customId) {

      case "self-ping":

        const row1 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Giveaways")
            .setStyle("SECONDARY")
            .setCustomId("self-giveaways"),
          new MessageButton()
            .setLabel("Events")
            .setStyle("SECONDARY")
            .setCustomId("self-event"),
          new MessageButton()
            .setLabel("Poll")
            .setStyle("SECONDARY")
            .setCustomId("self-poll"),
          new MessageButton()
            .setLabel("Announcement")
            .setStyle("SECONDARY")
            .setCustomId("self-announcement"),
        )

        const row2 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Fact of the day")
            .setStyle("SECONDARY")
            .setCustomId("self-fact"),
        )

        const e1 = new MessageEmbed()
          .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setTitle("Select a role using the buttons below to add or remove it")
          .setDescription("➜ Re-clicking a role that you already have will get it removed!\n\n** **")
          .setColor(`${client.color.serverPurple}`)
          .addFields(
            {
              name: "• Giveaways Ping",
              value: `Gets pinged whenever there is a new giveaway in <#870929654737952788>`,
              inline: false
            },
            {
              name: "• Events Ping",
              value: `Gets pinged whenever there is a new event in <#880401081497157643>`,
              inline: false
            },
            {
              name: "• Poll Ping",
              value: `Gets pinged whenever there is a new poll`,
              inline: false
            },
            {
              name: "• Announcement Ping",
              value: `Gets pinged whenever there is something important in <#797725925855723540>`,
              inline: false
            },
            {
              name: "• Fact of the day Ping",
              value: `Gets pinged whenever there is a new fact in <#887320955913928764>`,
              inline: false
            }
          );

        interaction.reply({ embeds: [e1], components: [row1, row2], ephemeral: true })
        break;


      case "self-pronoun":

        const row3 = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("He/Him")
            .setStyle("SECONDARY")
            .setCustomId("self-him"),
          new MessageButton()
            .setLabel("She/Her")
            .setStyle("SECONDARY")
            .setCustomId("self-her"),
          new MessageButton()
            .setLabel("They/Them")
            .setStyle("SECONDARY")
            .setCustomId("self-them"),
          new MessageButton()
            .setLabel("Ask for Pronouns")
            .setStyle("SECONDARY")
            .setCustomId("self-ask"),
        )


        const e2 = new MessageEmbed()
          .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setTitle("Select a role using the buttons below to add or remove it")
          .setDescription("➜ Re-clicking a role that you already have will get it removed!")
          .setColor(`${client.color.serverPurple}`)


        interaction.reply({ embeds: [e2], components: [row3], ephemeral: true });
        break;

      case "self-organization":
        if (interaction.member.roles.cache.get(roleorg)) {
          member.remove(roleorg, "Self roles");
          return interaction.reply({ content: `${remove} Role Organization`, ephemeral: true });
        } else {
          member.add(roleorg, "Self roles");
          interaction.reply({ content: `${add} Role Organization`, ephemeral: true });
        }
        break;

      // --------------------------

      case "self-giveaways":
        if (interaction.member.roles.cache.get(giveaways)) {
          member.remove(giveaways, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(giveaways).name}`, ephemeral: true });
        } else {
          member.add(giveaways, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(giveaways).name}`, ephemeral: true });
        }
        break;


      case "self-event":
        if (interaction.member.roles.cache.get(events)) {
          member.remove(events, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(events).name}`, ephemeral: true });
        } else {
          member.add(events, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(events).name}`, ephemeral: true });
        }
        break;


      case "self-poll":
        if (interaction.member.roles.cache.get(polls)) {
          member.remove(polls, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(polls).name}`, ephemeral: true });
        } else {
          member.add(polls, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(polls).name}`, ephemeral: true });
        }
        break;


      case "self-announcement":
        if (interaction.member.roles.cache.get(announcement)) {
          member.remove(announcement, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(announcement).name}`, ephemeral: true });
        } else {
          member.add(announcement, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(announcement).name}`, ephemeral: true });
        }
        break;


      case "self-fact":
        if (interaction.member.roles.cache.get(fotd)) {
          member.remove(fotd, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(fotd).name}`, ephemeral: true });
        } else {
          member.add(fotd, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(fotd).name}`, ephemeral: true });
        }
        break;

      // -------------------------------


      case "self-him":
        if (interaction.member.roles.cache.get(him)) {
          member.remove(him, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(him).name}`, ephemeral: true });
        } else {
          member.add(him, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(him).name}`, ephemeral: true });
        }
        break;


      case "self-her":
        if (interaction.member.roles.cache.get(her)) {
          member.remove(her, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(her).name}`, ephemeral: true });
        } else {
          member.add(her, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(her).name}`, ephemeral: true });
        }
        break;


      case "self-them":
        if (interaction.member.roles.cache.get(they)) {
          member.remove(they, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(they).name}`, ephemeral: true });
        } else {
          member.add(they, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(they).name}`, ephemeral: true });
        }
        break;


      case "self-ask":
        if (interaction.member.roles.cache.get(ask)) {
          member.remove(ask, "Self roles");
          return interaction.reply({ content: `${remove} ${interaction.guild.roles.cache.get(ask).name}`, ephemeral: true });
        } else {
          member.add(ask, "Self roles");
          interaction.reply({ content: `${add} ${interaction.guild.roles.cache.get(ask).name}`, ephemeral: true });
        }
        break;


      // --------------------------------------------


      case "self-check":

        const array = [];
        if (member.cache.get(giveaways)) array.push(`• ${interaction.guild.roles.cache.get(giveaways).name}`);
        if (member.cache.get(events)) array.push(`• ${interaction.guild.roles.cache.get(events).name}`);
        if (member.cache.get(polls)) array.push(`• ${interaction.guild.roles.cache.get(polls).name}`);
        if (member.cache.get(announcement)) array.push(`• ${interaction.guild.roles.cache.get(announcement).name}`);
        if (member.cache.get(fotd)) array.push(`• ${interaction.guild.roles.cache.get(fotd).name}`);
        if (member.cache.get(him)) array.push(`• ${interaction.guild.roles.cache.get(him).name}`);
        if (member.cache.get(her)) array.push(`• ${interaction.guild.roles.cache.get(her).name}`);
        if (member.cache.get(they)) array.push(`• ${interaction.guild.roles.cache.get(they).name}`);
        if (member.cache.get(ask)) array.push(`• ${interaction.guild.roles.cache.get(ask).name}`);

        const e3 = new MessageEmbed()
          .setAuthor({ name: `Current Self Roles`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setColor(`${client.color.serverPurple}`)
          .setDescription(array.length ? array.join("\n") : "Looks like you don't have any self roles!")
          .setFooter({ text: `Count: ${array.length}` })

        interaction.reply({ embeds: [e3], ephemeral: true })
        break;

      case "self-reset":

        member.remove(giveaways, "Reset Self roles");
        member.remove(events, "Reset Self roles");
        member.remove(polls, "Reset Self roles");
        member.remove(announcement, "Reset Self roles");
        member.remove(fotd, "Reset Self roles");
        member.remove(him, "Reset Self roles");
        member.remove(her, "Reset Self roles");
        member.remove(they, "Reset Self roles");
        member.remove(ask, "Reset Self roles");

        interaction.reply({ content: `${add} Reset the self roles!`, ephemeral: true })
        break;




    }

  };
});