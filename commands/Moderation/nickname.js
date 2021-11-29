const { MessageEmbed } = require('discord.js')
const randomnick = require("randomstring")

module.exports = {
    name : 'nickname',
    category : 'moderation',
    description : `Changes user's nickname.`,
    usage:'[user] [new nickname/reset/moderate]',
    aliases : ['nick'],
    cooldown: 3000,
    userPermissions: ["MANAGE_MESSAGES"],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args, missingpartembed, modlog) => {

        var name = message.content.split(" ").slice(2).join(" ")
        var user = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

        if(!args[0] || !name) return message.reply({ embeds: [missingpartembed]})

        let xxpermuser = new MessageEmbed().setDescription(`${client.botEmoji.failed} You can't do that!`).setColor(`${client.embedColor.failed}`)
        let xxpermbot = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't do that as their roles are higher then me.`).setColor(`${client.embedColor.failed}`)
        if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [xxpermbot]})
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [xxpermuser] })

        const nicknamegen = randomnick.generate({
            length: 4,
            charset: "alphanumeric"
        });

        const nickname = `Moderated Nickname ${nicknamegen}`

        let logreset = new MessageEmbed()
        .setAuthor(`Action: Change Nickname`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
        .addField("● Nickname Info", `> New Nickname: Nickname resets | ${user.user.username}`)
        .setTimestamp()

        let logmod = new MessageEmbed()
        .setAuthor(`Action: Moderate Nickname`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.member.user}\n> __Tag:__ ${message.member.user.tag}\n> __ID:__ ${message.member.user.id}`, true)
        .addField("● Nickname Info", `> New Nickname: ${nickname}`)
        .setTimestamp()

    
        let rest = new MessageEmbed().setDescription(`Reseted the nickname of ${user.user.tag}.`).setColor(`${client.embedColor.moderation}`)
        if(name.toLowerCase() === "reset") return user.setNickname(user.user.username).then(() => message.channel.send({ embeds: [rest]}).then(message.delete()).then(() => modlog.send({ embeds: [logreset]}))) 
        
        if(!user.displayName.startsWith("Moderated Nickname")) {
        var mode = new MessageEmbed().setDescription(`Moderated the nickname to ${nickname}.`).setColor(`${client.embedColor.moderation}`)
        if(name.toLowerCase() === "moderate") return user.setNickname(nickname).then(() => message.channel.send({ embeds: [mode]}).then(message.delete()).then(() => modlog.send({ embeds: [logmod]}))) 
        } else return message.reply("This user already has a moderated nickname!")
        
    
    
        let nochnaeg = new MessageEmbed().setColor(`${client.embedColor.failed}`).setDescription(`${client.botEmoji.failed} Nothing changed as you provided their current nickname.`)
        if(name == user.displayName) return message.reply({ embeds: [nochnaeg]})
     
    
        let chnaged = new MessageEmbed().setDescription(`Changed ${user.user.username} nickname to \`${name}\``).setColor(`${client.embedColor.moderation}`)
        message.reply({ embeds: [chnaged]})
        user.setNickname(name)
    
        let log2 = new MessageEmbed()
        .setAuthor(`Action: Change Nickname`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`[**Click here to jump to the message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setColor(`${client.embedColor.logYellow}`)
        .addField('Member Info', `● ${user.user}\n> __Tag:__ ${user.user.tag}\n> __ID:__ ${user.user.id}`, true)
        .addField("Mod Info", `● ${message.author}\n> __Tag:__ ${message.author.tag}\n> __ID:__ ${message.author.id}`, true)
        .addField("● Nickname Info", `> New Nickname: ${name}`)
        .setTimestamp()
        modlog.send({ embeds: [log2]})


    }
}