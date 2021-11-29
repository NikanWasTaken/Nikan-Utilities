const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = {
    name : 'nickname',
    category : 'moderation',
    description : `Change user's nickname using ">nickname (user) (nickname). You can use both ID and mention in user section and you can also use "reset" in nickname section to reset someone's nickname.`,
    usage:'Moderators',
    aliases : ['nick'],

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        let noperm = new MessageEmbed()
        .setDescription(`You don't have permissions to run this command.`)
        .setColor("#b3666c")

        var modlog = new Discord.WebhookClient('842688628472021022', 'SSimpYCciyQL06O-XO0tSBS9BoLFzOv__kh7MD9_0F3pvp3elU_tYldf82lpoUEOICQo');


        var name = message.content.split(" ").slice(2).join(" ")
        var target = message.mentions.members.first() || message.guild.member(args[0])
        var target2 = message.mentions.users.first() || client.users.cache.find(user => user.id === args[0])
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(noperm).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        var ded = new MessageEmbed().setDescription("<a:red_x:872203367718457424> Can not find that user.").setColor("RED")
        if(!target) return message.channel.send(ded).then(message => message.delete({timeout: 5000})).then(() => message.delete()).then(message => message.delete({timeout: 5000})).then(() => message.delete())
        var dad = new MessageEmbed().setDescription("<a:red_x:872203367718457424> You should provide a reason.").setColor("RED")
        if(!name) return message.channel.send("Please provide a nickname.")
    
        var rip12 = new MessageEmbed()
           .setAuthor(`Nickname | ${target2.tag}`, target2.displayAvatarURL( { dynamic:true } ))
          .setColor("#42e9f5")
          .setTimestamp()
          .addFields({
            name: 'Member',
            value: `${target.user}`,
            inline: true
           }, {
            name: 'Moderator',
            value: `${message.author}`, 
            inline: true
           }, {
            name: 'Nickname',
            value: `Nickname reset`, 
            inline: false
          });
    
        if(name.toLowerCase() === "reset") return target.setNickname(target2.username).then(() => message.channel.send(`${message.author}, Nickname for \`${target.user.tag}\` reset.`).then(() => modlog.send(rip12)))
    
    
        if(name == target.displayName) return message.channel.send(`${message.author}, You provided his Current nickname, nothing changed.`).then(message => message.delete({timeout: 7000})).then(() => message.delete())
          var youx = new MessageEmbed().setDescription(`<a:red_x:872203367718457424> I can not do that with people with higher or same position as myself.`).setColor("RED")
          if(target.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send(youx).then(message => message.delete({timeout: 5000})).then(() => message.delete())
          var xx = new MessageEmbed().setDescription(`<a:red_x:872203367718457424> <a:red_x:872203367718457424> You can't do that with people with higher or same position as yourself.`).setColor("RED")
          if(target.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(xx).then(message => message.delete({timeout: 5000})).then(() => message.delete())
     
    
        message.channel.send(`${message.author}, Changed \`${target.user.tag}\`'s nickname to **${name}**.`)
        target.setNickname(name)
    
        var rip = new MessageEmbed()
           .setAuthor(`Nickname | ${target2.tag}`, target2.displayAvatarURL( { dynamic:true } ))
          .setColor("#42e9f5")
          .setTimestamp()
          .addFields({
            name: 'Member',
            value: `${target.user}`,
            inline: true
           }, {
            name: 'Moderator',
            value: `${message.author}`, 
            inline: true
           }, {
            name: 'Nickname',
            value: `${name}`, 
            inline: false
          
          });
    
          modlog.send(rip)

    }
}