let Discord = require("discord.js")
let client = new Discord.Client()


module.exports = message => {

 if (message.content.toLowerCase().startsWith('>invite')) {
   message.channel.send(`${message.author}, This bot is completely private. That means you can't invite the bot to your server. But if you wanna check your invite count to this server, try using` + " `%invites` " + `in <#800421771114709022>.`)
 }



 if (message.content.toLowerCase().startsWith('!rank')) {
   if (message.channel.id !== '800421771114709022') {
   message.channel.send(`${message.author}, make sure to use rank command in <#800421771114709022>, it won't work here.`)
 } else
  return;
 }



if(message.content === "<@!814012282241286155>") {
  message.channel.send(`${message.author}, Need help about this bot? try running ` + "`>help`.")
}

if(message.content.startsWith(">vote")) {
  var vote = new Discord.MessageEmbed().setDescription(`Vote for Nikan's World [here](https://top.gg/servers/757268973674037315/vote).`).setColor("#2ECC71")
  message.channel.send(vote)
}

}