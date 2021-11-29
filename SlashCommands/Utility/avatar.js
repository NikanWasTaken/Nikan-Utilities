const { Client, CommandInteraction, MessageEmbed } = require("discord.js");


module.exports = {
    name: "avatar",
    cooldown: 5000,
    botCommandOnly: true,
    description : `Shows a user's avatar/profile picture.`,
    options: [
        {
          name: "user",
          description: "The user you want to see their pfp. Leave this empty for your own pfp.",
          required: false,
          type: "USER",

        }
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {



           const user = interaction.options.getMember("user") || interaction.member;
            const avatarEmbed = new MessageEmbed()
            .setColor("RANDOM") 
            .setAuthor(client.user.tag, client.user.displayAvatarURL( { dynamic:true } ))
            .setTitle(`${user.user.username}'s Avatar Preview `)
            .setURL(user.user.displayAvatarURL({ dynamic:true }))
            .setImage(user.user.displayAvatarURL( { dynamic:true , size: 1024} ))
            .setFooter(`Requested by ${interaction.member.user.username}`, interaction.member.user.displayAvatarURL( { dynamic:true } ))
            interaction.followUp({ embeds: [avatarEmbed]})

    }
}