const { MessageEmbed } = require("discord.js");

module.exports = {
    name : '8ball',
    category : 'Fun',
    description : '8ball answers to your question!',
    usage:'<#800421771114709022>',
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

        if (message.channel.id !== '800421771114709022') return message.channel.send(botcmd).then((m) => m.delete( { timeout: 5000})).then(message.delete())

    if (!args[1])
      return message.channel.send(
        `No question was provided`,
      );
    let replies = [
      "I think so",
      "Yes",
      "I guess",
      "Yeah absolutely",
      "Maybe",
      "Possibly",
      "No",
      "Most likely",
      "No Way!",
      "I dont know",
      "Without a doubt",
      "Indeed",
      "For sure",
    ];

    let result = Math.floor(Math.random() * replies.length);
    let question = args.join(" ");

    let embed = new MessageEmbed()

      .setColor("#e6cc93")
      .setDescription(`🎱 ${replies[result]}`)

    message.channel.send(embed);
  },
};