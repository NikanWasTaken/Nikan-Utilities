const { Client, CommandInteraction, Message, MessageEmbed } = require("discord.js");
const moment = require("moment")


module.exports = {
    name: "snipe",
    description : 'Snipe a recently deleted messages in the channel.',
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
          name: "sniped-message-number",
          description: "The number of sniped message you want to find.",
          required: false,
          type: "INTEGER",

        },
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {


            const snipes = client.snipes.get(interaction.channel.id);
            if(!snipes) return interaction.followUp("There is no recently deleted interactions in this channel!")
    
            const snipe = +args[0] - 1 || 0;
            const target = snipes[snipe]; 
            if(!target) return interaction.followUp(`Thire is only ${snipes.length} sniped messages!`)
    
            const { msg, time, image } = target; 
    
            let embed = new MessageEmbed()
             .setAuthor(msg.author.tag, msg.author.displayAvatarURL( { dynamic: true }))
             .setColor("RANDOM")
             .setImage(image)
             .setDescription(msg.content)
             .setFooter(`${moment(time).fromNow()} | ${snipe + 1} / ${snipes.length}`)
    
            interaction.followUp({ embeds: [embed]})
    


    }
}