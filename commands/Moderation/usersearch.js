const { Client, Message, MessageEmbed, Discord } = require("discord.js");

module.exports = {
  name: "usersearch",
  description:
    "Search for people's 'username, tag, ID, discriminator (the 4 number at the end of the username), #discriminator and nickname' in this server!",
  category: "Moderation",
  aliases: ["usearch"],
  usage: 'Moderators',
  
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {


    let noperm = new MessageEmbed()
    .setDescription(`You don't have permissions to run this command.`)
    .setColor("#b3666c")

    try {
      
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noperm).then((m) => m.delete( {timeout: 5000 })).then(message.delete())

    const user = args.join(" ")
    if (!user) return message.channel.send("Please specify a user to find.");
    if(user.length <= 2) return message.channel.send("You can only search for +3 letters.")
    const array = [];

    message.guild.members.cache.forEach((use) => {
      if (use.user.username.toUpperCase() == user.toUpperCase() || use.user.id === user.toUpperCase() || use.user.tag.toUpperCase() == user.toUpperCase() || use.displayName.toUpperCase() == user.toUpperCase()|| use.user.discriminator == user.toUpperCase() 
      || `#${use.user.discriminator}` == user.toUpperCase() || use.user.username.toUpperCase().includes(user.toUpperCase()) || use.displayName.toUpperCase().includes(user.toUpperCase())) {

        array.push(`● ${use.user}\n> __Tag:__ ${use.user.tag}\n> __ID:__ ${use.user.id}\n> __Nickname:__ ${use.displayName == use.user.username ? "No Nickname" : use.displayName}\n`);
      }
    });

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} ● Searching for ${user}`, message.guild.iconURL( {dynamic: true}))
      .setColor("RED")
      .setDescription(array.join("\n") || "<a:red_x:872203367718457424> No Results - Can't Find Any User!")
      .setFooter(array.length == 0 ? "No Result" : array.length == 1 ? `${array.length} Result` : `${array.length} Results`)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/870637449158742057/874944240290005042/bloodbros-search.gif")
    message.channel.send(embed)
  } catch (error) {
      message.channel.send("The search results and too many, can't send them all in a single embed!")

  }
  },
};
