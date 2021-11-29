const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const math = require("mathjs")


module.exports = {
    name: "calculate",
    description : `Calculate things for you!`,
    botCommandOnly: true,
    cooldown: 5000,
    options: [
        {
          name: "question",
          description: "Your math question.",
          required: true,
          type: "STRING",

        }
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let question = interaction.options.getString("question")


           try {

           var ee = new MessageEmbed()
           .setTitle("Calculator")
           .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/870637899287244800/IMG_6787_1.png")
           .setDescription(`**Question:** ${question}\n**Answer:** ${math.evaluate(question)}\n`)
           .setColor("#4c9ad2")
           .setFooter(`Requested by ${interaction.member.user.username}`, interaction.member.user.displayAvatarURL( { dynamic:true } ))
            interaction.followUp("Calculating...").then((m) => m.edit({embeds: [ee]}))

                   
        } catch (error) {
            interaction.followUp("Your question is invalid!")    
        }
        

    }
}