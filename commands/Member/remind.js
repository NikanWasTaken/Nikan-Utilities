const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    name : 'remind',
    category : 'member',
    description : 'Reminds you! Usage: `>remind (time) (reason)` | e.g. >remind 2s test.',
    usage: `<#800421771114709022>, <#844418140796092466>`,
    aliases: ["remindme", "reminder", "remind-me"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

       let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
        let reminder = args.slice(1).join(' ');
        let time = args[0];
    

        if(message.channel.id === "844418140796092466" || message.channel.id === "800421771114709022") {

        if(!time) return message.reply('Please specify a time to remind in!').then((m) => m.delete( { timeout: 5000})).then(message.delete())
    
        if(!reminder) return message.reply('Please state the reason that you want to get reminded!').then((m) => m.delete( { timeout: 5000})).then(message.delete())
    
    
        const setreminderembed = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setDescription(`<a:green_check:872203367047397426> I'll remind you in ${time} **|** ${reminder} `)
    
        message.channel.send(setreminderembed);
    
        setTimeout(async function () {
    
          const alertembed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setAuthor('Reminder Alarm!', "https://cdn.discordapp.com/attachments/870637449158742057/870638154040893471/DynoTimer.png")
        .setDescription(`⏰ ${reminder}`)
        .setFooter(`Reminded you from ${time} ago!`, message.author.displayAvatarURL())
    
        message.member.send(alertembed)
        }, ms (time));

      } else 
      message.channel.send(botcmd).then((m) => m.delete( { timeout: 5000})).then(message.delete())
    }
}
