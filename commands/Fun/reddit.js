const { MessageEmbed } = require('discord.js')
const fetch = require("node-fetch")

module.exports = {
    name : 'reddit',
    category : 'Fun',
    description : `Find a cool and hot reddit meme using ">reddit".`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    aliases :['meme'],
    

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {


        let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`
        
        const https = require('https');
        const url = 'https://www.reddit.com/r/memes/hot/.json?limit=100';
       

          if (message.channel.id === '800421771114709022' || message.channel.id === "844418140796092466") {
        https.get(url, result => {
        var body = '';
        result.on('data', chunk => {
        body += chunk;
        });
       
        result
        .on('end', () => {
        var response = JSON.parse(body);
        var index =
        response.data.children[Math.floor(Math.random() * 99) + 1].data;
       
        var link = 'https://reddit.com' + index.permalink;
       
        if (index.post_hint !== 'image') {
        var text = index.selftext;
        const textembed = new MessageEmbed()
        .setTitle(`${title}`)
        .setColor('RANDOM')
        .setURL(link);
       
        message.channel.send(textembed);
        }
       
        var image = index.preview.images[0].source.url.replace('&amp;', '&');
        var title = index.title;
        var subRedditName = index.subreddit_name_prefixed;
       
        if (index.post_hint !== 'image') {
        const textembed = new MessageEmbed()
        .setTitle(`${title}`)
        .setColor('RANDOM')
        .setURL(link);
       
        message.channel.send(textembed);
        }
        const imageembed = new MessageEmbed()
        .setTitle(`${title}`)
        .setImage(image)
        .setColor('RANDOM')
        .setURL(link);
        message.channel.send("Searching for a cool meme...").then((m) => m.edit(imageembed))
        })
        .on('error', function(e) {
        console.log('Got an error: ', e);
        });
        });
        } else 
              message.reply(botcmd).then(message => message.delete({timeout: 10000}));
       
        }

    
}