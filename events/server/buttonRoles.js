const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require("../../index.js")

client.on("interactionCreate", async (interaction) => {


  if (interaction.isButton()) {

    // mains

    if (interaction.customId === "ping-roles-main") {

      const row = new MessageActionRow().addComponents(


        new MessageButton()
          .setLabel("Giveaways")
          .setEmoji("<a:SR_giveaways:897844189096722532>")
          .setStyle("SECONDARY")
          .setCustomId("giveaways-role"),

        new MessageButton()
          .setLabel("Events")
          .setEmoji("<a:SR_events:897844431200321567>")
          .setStyle("SECONDARY")
          .setCustomId("events-role"),

        new MessageButton()
          .setLabel("Fact of the day")
          .setEmoji("📆")
          .setStyle("SECONDARY")
          .setCustomId("fact-role"),

      )

      const row2 = new MessageActionRow().addComponents(

        new MessageButton()
          .setLabel("Announcement")
          .setEmoji("<a:SR_announcement:897845111851978792>")
          .setStyle("SECONDARY")
          .setCustomId("announcement-role"),

          new MessageButton()
          .setLabel("Poll")
          .setEmoji("<:SR_poll:897861440596213770>")
          .setStyle("SECONDARY")
          .setCustomId("poll-role"),


      )

      const row3 = new MessageActionRow().addComponents(

          new MessageButton()
          .setLabel("Clear Ping Roles")
          .setStyle("DANGER")
          .setCustomId("clear-ping-roles"),

          new MessageButton()
          .setLabel("Add all ping roles")
          .setStyle("SUCCESS")
          .setCustomId("add-all-ping-roles"),


      )

      const embed = new MessageEmbed()
        .setDescription("Please select your ping roles by clicking on the buttons below!")
        .setColor("BLURPLE")

      interaction.reply({ embeds: [embed], components: [row, row2, row3], ephemeral: true })

    }

    // main 2

    if (interaction.customId === "other-roles-main") {

      const row = new MessageActionRow().addComponents(


        new MessageButton()
          .setLabel("Pronouns")
          .setEmoji("🗣")
          .setStyle("SECONDARY")
          .setCustomId("Pronouns-semi-main"),


      )

      const embed = new MessageEmbed()
        .setDescription("Please select the category of the other self roles!")
        .setColor("BLURPLE")

      interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

    }

    // main 3

    if (interaction.customId === "role-organization") {

      if (interaction.member.roles.cache.get("868378820120547378")) {

        interaction.member.roles.remove("868378820120547378")

        const embed = new MessageEmbed()
        .setDescription("Removed: Role Organization!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        interaction.member.roles.add("868378820120547378")

        const embed = new MessageEmbed()
          .setDescription("Added: Role Organization!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

      }

    }

    // ping roles --- :)


    //giveaways

    if (interaction.customId === "giveaways-role") {

      if (interaction.member.roles.cache.get("831754757932580895")) {

        interaction.member.roles.remove("831754757932580895")

        const embed = new MessageEmbed()
        .setDescription("Removed: Giveaways!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        interaction.member.roles.add("831754757932580895")

        const embed = new MessageEmbed()
          .setDescription("Added: Giveaways!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

      }

    }

          // events

    if (interaction.customId === "events-role") {

      if (interaction.member.roles.cache.get("880401182131114024")) {

        interaction.member.roles.remove("880401182131114024")

        const embed = new MessageEmbed()
        .setDescription("Removed: Events!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        interaction.member.roles.add("880401182131114024")

        const embed = new MessageEmbed()
          .setDescription("Added: Events!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

      }

    }

    // fact of the day 

    if (interaction.customId === "fact-role") {

      if (interaction.member.roles.cache.get("887285307668561930")) {

        interaction.member.roles.remove("887285307668561930")

        const embed = new MessageEmbed()
        .setDescription("Removed: Fact of the day!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true })

      } else {

        interaction.member.roles.add("887285307668561930")

        const embed = new MessageEmbed()
          .setDescription("Added: Fact of the day!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

      }

    }

    // announcement

    if (interaction.customId === "announcement-role") {

      if (interaction.member.roles.cache.get("897836245760237588")) {

        interaction.member.roles.remove("897836245760237588")

        const embed = new MessageEmbed()
        .setDescription("Removed: Announcement!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        interaction.member.roles.add("897836245760237588")

        const embed = new MessageEmbed()
          .setDescription("Added: Announcement!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

      }

    }

    // poll 

    if (interaction.customId === "poll-role") {

      if (interaction.member.roles.cache.get("833174349732642836")) {

        interaction.member.roles.remove("833174349732642836")

        const embed = new MessageEmbed()
        .setDescription("Removed: Poll!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        interaction.member.roles.add("833174349732642836")

        const embed = new MessageEmbed()
          .setDescription("Added: Poll!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

      }

    }

    // clear ping roles

    if (interaction.customId === "clear-ping-roles") {

      interaction.member.roles.remove("831754757932580895")
      interaction.member.roles.remove("880401182131114024")
      interaction.member.roles.remove("833174349732642836")
      interaction.member.roles.remove("887285307668561930")
      interaction.member.roles.remove("897836245760237588")

      const embed = new MessageEmbed().setDescription("Cleared all of your ping roles!").setColor("RED")
      interaction.reply({ embeds: [embed], ephemeral: true })

    }

    // add all ping roles

    if (interaction.customId === "add-all-ping-roles") {

      interaction.member.roles.add("831754757932580895")
      interaction.member.roles.add("880401182131114024")
      interaction.member.roles.add("833174349732642836")
      interaction.member.roles.add("887285307668561930")
      interaction.member.roles.add("897836245760237588")

      const embed = new MessageEmbed().setDescription("Added all the ping roles!").setColor("GREEN")
      interaction.reply({ embeds: [embed], ephemeral: true })

    }

    // OTHER PART LMFAO


    if (interaction.customId === "Pronouns-semi-main") {

    
      const row = new MessageActionRow().addComponents(


        new MessageButton()
          .setLabel("He/Him")
          .setStyle("SECONDARY")
          .setCustomId("he-him"),

          new MessageButton()
          .setLabel("She/Her")
          .setStyle("SECONDARY")
          .setCustomId("she-her"),

          new MessageButton()
          .setLabel("They/Them")
          .setStyle("SECONDARY")
          .setCustomId("they-them"),

          new MessageButton()
          .setLabel("Ask For Pronouns")
          .setStyle("SECONDARY")
          .setCustomId("ask-pronouns"),


      )

      const row2 = new MessageActionRow().addComponents(


          new MessageButton()
          .setLabel("Any Pronouns")
          .setStyle("SECONDARY")
          .setCustomId("any-pronouns"),

          new MessageButton()
          .setLabel("Clear Pronouns Roles")
          .setStyle("DANGER")
          .setCustomId("clear-pronouns"),



      )

      const embed = new MessageEmbed()
        .setDescription("Please select your pronouns by clicking the buttons below!\n*You can choose multiple*")
        .setColor("BLURPLE")

      interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true })

    }


    // Pronouns hahhh


    if (interaction.customId === "he-him") {

      if (interaction.member.roles.cache.get("897829275066040351")) {

        interaction.member.roles.remove("897829275066040351")

        const embed = new MessageEmbed()
        .setDescription("Removed: He/Him!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        if(interaction.member.roles.cache.get("897829284671008811") || interaction.member.roles.cache.get("897829538594185276")) {

          const embed = new MessageEmbed().setDescription("You need to not have any of the any/ask pronouns roles in order to add this option.")

          interaction.reply({ embeds: [embed], ephemeral: true})

        } else {

        interaction.member.roles.add("897829275066040351")

        const embed = new MessageEmbed()
          .setDescription("Added: He/Him!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

        }

      }

    }


    if (interaction.customId === "she-her") {

      if (interaction.member.roles.cache.get("897829279793045514")) {

        interaction.member.roles.remove("897829279793045514")

        const embed = new MessageEmbed()
        .setDescription("Removed: She/Her!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        if(interaction.member.roles.cache.get("897829284671008811") || interaction.member.roles.cache.get("897829538594185276")) {

          const embed = new MessageEmbed().setDescription("You need to not have any of the any/ask pronouns roles in order to add this option.")

          interaction.reply({ embeds: [embed], ephemeral: true})

        } else {

        interaction.member.roles.add("897829279793045514")

        const embed = new MessageEmbed()
          .setDescription("Added: She/Her!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

        }

      }

    }

    if (interaction.customId === "they-them") {

      if (interaction.member.roles.cache.get("897829282443845632")) {

        interaction.member.roles.remove("897829282443845632")

        const embed = new MessageEmbed()
        .setDescription("Removed: They/Them!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        if(interaction.member.roles.cache.get("897829284671008811") || interaction.member.roles.cache.get("897829538594185276")) {

          const embed = new MessageEmbed().setDescription("You need to not have any of the any/ask pronouns roles in order to add this option.")

          interaction.reply({ embeds: [embed], ephemeral: true})

        } else {

        interaction.member.roles.add("897829282443845632")

        const embed = new MessageEmbed()
          .setDescription("Added: They/Them!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

        }

      }

    }

    if (interaction.customId === "ask-pronouns") {

      if (interaction.member.roles.cache.get("897829284671008811")) {

        interaction.member.roles.remove("897829284671008811")

        const embed = new MessageEmbed()
        .setDescription("Removed: Ask for Pronouns!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        if(interaction.member.roles.cache.get("897829275066040351") || interaction.member.roles.cache.get("897829279793045514") || interaction.member.roles.cache.get("897829282443845632") || interaction.member.roles.cache.get("897829284671008811") || interaction.member.roles.cache.get("897829538594185276")) {

          const embed = new MessageEmbed().setDescription("You need to not have any another pronouns role in order to add this option, try again after you removed other pronouns roles!")

          interaction.reply({ embeds: [embed], ephemeral: true})

        } else {

        interaction.member.roles.add("897829284671008811")

        const embed = new MessageEmbed()
          .setDescription("Added: Ask for Pronouns!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

        }

      }

    }

    if (interaction.customId === "any-pronouns") {

      if (interaction.member.roles.cache.get("897829538594185276")) {

        interaction.member.roles.remove("897829538594185276")

        const embed = new MessageEmbed()
        .setDescription("Removed: Any Pronouns!")
        .setColor("RED")

      interaction.reply({ embeds: [embed], ephemeral: true }) 

      } else {

        if(interaction.member.roles.cache.get("897829275066040351") || interaction.member.roles.cache.get("897829279793045514") || interaction.member.roles.cache.get("897829282443845632") || interaction.member.roles.cache.get("897829284671008811") || interaction.member.roles.cache.get("897829538594185276")) {

          const embed = new MessageEmbed().setDescription("You need to not have any another pronouns role in order to add this option, try again after you removed other pronouns roles!")

          interaction.reply({ embeds: [embed], ephemeral: true})

        } else {
          
        interaction.member.roles.add("897829538594185276")

        const embed = new MessageEmbed()
          .setDescription("Added: Any Pronouns!")
          .setColor("GREEN")

        interaction.reply({ embeds: [embed], ephemeral: true })

        }

      }

    }

    if (interaction.customId === "clear-pronouns") {

      interaction.member.roles.remove("897829275066040351")
      interaction.member.roles.remove("897829279793045514")
      interaction.member.roles.remove("897829282443845632")
      interaction.member.roles.remove("897829284671008811")
      interaction.member.roles.remove("897829538594185276")

      const embed = new MessageEmbed().setDescription("Cleared all of your pronouns roles!").setColor("GREEN")
      interaction.reply({ embeds: [embed], ephemeral: true })

    }



    if (interaction.customId === "not-sure-roles") {

      const roles = [];

      if (interaction.member.roles.cache.get("831754757932580895")) roles.push("> Ping Role: Giveaways")
      if (interaction.member.roles.cache.get("880401182131114024")) roles.push("> Ping Role: Events")
      if (interaction.member.roles.cache.get("833174349732642836")) roles.push("> Ping Role: Polls")
      if (interaction.member.roles.cache.get("887285307668561930")) roles.push("> Ping Role: Fact of the day")
      if (interaction.member.roles.cache.get("897836245760237588")) roles.push("> Ping Role: Announcement")
      if (interaction.member.roles.cache.get("897829275066040351")) roles.push("> Other: He/Him")
      if (interaction.member.roles.cache.get("897829279793045514")) roles.push("> Other: She/Her")
      if (interaction.member.roles.cache.get("897829282443845632")) roles.push("> Other: They/Them")
      if (interaction.member.roles.cache.get("897829284671008811")) roles.push("> Other: Ask For Pronouns")
      if (interaction.member.roles.cache.get("897829538594185276")) roles.push("> Other: Any Pronouns")

      else

        if (roles.length === 0) {
          return interaction.reply({ content: "You don't have self roles!", ephemeral: true })
        }


      const embed = new MessageEmbed()
        .setAuthor("Your cuurent self roles", interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`\n${roles.join(`\n`)}`)
        .setFooter(`Count: ${roles.length}`)
        .setTimestamp()
        .setColor("YELLOW")

      interaction.reply({ embeds: [embed], ephemeral: true })

    }






  };

});