const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const warnModel = require("../../models/Punishments.js")



module.exports = {
    name: "kick",
    description : `Kicks a member from the server!`,
    userPermissions: ["KICK_MEMBERS"],
    cooldown: 5000,
    options: [
        {
          name: "user",
          description: "The user you want to kick!",
          required: true,
          type: "USER",

        },
        {
            name: "reason",
            description: "The reason of the kick!",
            required: false,
            type: "STRING",
  
          }
      ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, modlog) => {

        var user = interaction.options.getMember("user")    

         var reason = interaction.options.getString("reason") || "No reason provided"

         let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't ban that user as they are mod/admin.`).setColor(`${client.embedColor.failed}`)
         let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't ban that user as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
         if(user.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [xxpermbot] })
         if (user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({ embeds: [xxpermuser] })
        
                 
        const data = new warnModel({
          type: "Kick",
          userId: user.user.id,
          guildId: interaction.guildId,
          moderatorId: interaction.user.id,
          reason,
          timestamp: Date.now(),
      })

      data.save();

        var hmm = new MessageEmbed()
        .setDescription(`${user.user} has been **kicked** | \`${data._id}\``).setColor(`${client.embedColor.moderation}`)
        interaction.followUp({ embeds: [hmm]})
  
  
        var dmyes = new MessageEmbed()
        .setAuthor(`Nikan's Utilities`, client.user.displayAvatarURL( { dynamic:true } ))
        .setTitle(`You've been kicked from ${interaction.guild.name}`)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
        .setFooter(`Server ID: ${interaction.guild.id}`)
        .addField("Punishment ID", `${data._id}`, true)
        .addField("Reason", reason, false)
        user.send({ embeds: [dmyes]}).catch(e => { return })
  
        user.kick({
          reason: reason,
        })
        
  
        let log = new MessageEmbed()
        .setAuthor(`Action: Kick`, interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the interaction**](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
        .setColor(`${client.embedColor.logRed}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${interaction.member.user}\n> __Tag:__ ${interaction.member.user.tag}\n> __ID:__ ${interaction.member.user.id}`, true)
        .addField("● Kick Info", `> Reason: ${reason}\n> Punishment ID: ${data._id}`, false)
        .setTimestamp()

        modlog.send({ embeds: [log]})

  

    }
}