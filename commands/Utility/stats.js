const { MessageEmbed } = require('discord.js')

const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const { re } = require('mathjs');

module.exports = {
    name : 'stats',
    category : 'Bot Developer',
    description: `Returns the bot's stats including cpu usage, ram etc...`,
    usage: 'Bot developer only',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

    const { totalMemMb, usedMemMb } = await mem.info();

    if(message.member.roles.cache.get("813983796361428993") || message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("844073380046307348")) {
        
                const systeminfo = stripIndent`
                Bot OS  : ${await os.oos()}
                CPU       : ${cpu.model()}
                CPU Cores : ${cpu.count()}
                CPU Usage : ${await cpu.usage()} %
                RAM       : ${totalMemMb} MB
                RAM Usage : ${usedMemMb} MB 
                Memory    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
                `;
        
                const embed = new MessageEmbed()
                .setTitle(`${client.user.username}'s stats`)
                .setDescription(`\`\`\`yaml\n${systeminfo}\`\`\``)
                .setColor("BLUE")
        
                message.channel.send("Gathering bot's stats...").then((m)=> m.edit(embed))

            } else 
            return message.channel.send(noperm).then((m) => m.delete( { timeout: 5000 } )).then(message.delete())
        
        }
        
}