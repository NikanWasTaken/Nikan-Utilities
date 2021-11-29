const { MessageEmbed } = require('discord.js')
const moment = require("moment")


module.exports = {
    name : 'roleinfo',
    category : 'member',
    description : 'Check a user information using ">roleinfo (role)". You can use role ID and role name in the role section.',
    usage:'<#800421771114709022>, <#844418140796092466>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

       let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

      if(message.channel.id === "800421771114709022" || message.channel.id === "844418140796092466") {

      if(args[0]) {
        

        const rolename = message.content.split(" ").slice(1).join(" ")
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find((r) => r.name.toLowerCase() == rolename)


        const embed = new MessageEmbed()
        .setTitle(`"${role.name}" Role info`)
        .addField(`Users that have this role: \`${role.members.size}\` Users`, `------------------------------------------`, false)
        .addField('Color', `\`${role.hexColor.toUpperCase()}\``, true)
        .addField('Position', `\`${Math.floor(message.guild.roles.cache.size - role.position)} / ${message.guild.roles.cache.size}\``, true)
        .addField('Creation Date', `\`${moment(role.createdAt).format('DD/MM/YYYY')}\``, true)
        .setColor(role.hexColor.toUpperCase())
        .setFooter(`ID: ${role.id}`)
        .setTimestamp()

        message.channel.send(embed)
        
        
      } else 
      return message.channel.send(`${message.author} Please state a role name/id.`).then((m) => m.delete( {timeout: 5000})).then(message.delete())

    } else 
    return message.channel.send(botcmd).then((m) => m.delete( {timeout: 5000})).then(message.delete())

    }
}
