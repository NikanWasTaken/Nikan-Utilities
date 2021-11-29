let Discord = require("discord.js")
let client = new Discord.Client()
let dbd = require("quick.db")

  


let offensive = ["fuck", "piss", "wanker", "tosser", "bollocks", "asshole", "prick", "bastard", "bellend", "arse", "f*ck", "fu*k"]
let nsfw = ["bitch", "nigg", "dick", "cunt", "puss", "sex", "nude", "boob", "porn", "penis", "shit", "sh!t", "sh*t", "sussy baka"]



let linkby = ["843694394963394590", "807265233096933406", "844079208128053249", "819204655451734046", "844418140796092466", "814777367498981378", "810466123891998730"]
let inviteby = ["807265233096933406", "814777367498981378", "819204655451734046"]

let byall = ["800976899337355294"]


module.exports = (message, client, autolog) => {





 for (var q in nsfw) {
   if(message.author.bot) return
 if (message.toString().toLowerCase().includes(nsfw[q])) {
   if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("845605598157996043") || message.member.roles.cache.get("844073380046307348")) return 
   message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author} you're not allowed to send prohibited words in this chnanel.`).then(message => message.delete({timeout: 7000}));
      let embede = new Discord.MessageEmbed()
        .setTitle("[Automod] Prohitied Word")
        .setColor("#b3666c")
        .setTimestamp()
        .addFields({
        name: 'Member',
        value: `${message.author}`,
        inline: true
        }, {
        name: "Channel",
        value: `${message.channel}`,
        inline: true
        }, {
        name: "Sentence",
        value: `||${message.content}||`
        });
   autolog.send(embede)
   message.delete()



 }

 }

 for (var x in offensive) {
   if(message.author.bot) return
 if (message.toString().toLowerCase().includes(offensive[x])) {
   if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("845605598157996043") || message.member.roles.cache.get("844073380046307348")) return 
   message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author}, you're not allowed to send phrases or words that include profanity.`).then(message => message.delete({timeout: 7000}));
      let embede = new Discord.MessageEmbed()
        .setTitle("[Automod] Profanity Word")
        .setColor("#b3666c")
        .setTimestamp()
        .addFields({
        name: 'Member',
        value: `${message.author}`,
        inline: true
        }, {
        name: "Channel",
        value: `${message.channel}`,
        inline: true
        }, {
        name: "Sentence",
        value: `||${message.content}||`
        });
   autolog.send(embede)
   message.delete()


 }
}
 



// links and invites 





    if (message.toString().toLowerCase().includes("discord.gg/")) {
    if(message.author.bot) return 
    if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("845605605569855499") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("844073380046307348")) return 
    if(inviteby.includes(message.channel.id)) return 
    message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author} you are not allowed to send invites in this channel. You can advertise your content in <#807265233096933406>.`).then(message => message.delete({timeout: 10000}))
    message.delete();
    let mebed = new Discord.MessageEmbed()
        .setTitle("[Automod] Discord Invite")
        .setColor("#b3666c")
        .setTimestamp()
        .addFields({
        name: 'Member',
        value: `${message.author}`,
        inline: true
        }, {
        name: "Channel",
        value: `${message.channel}`,
        inline: true
        }, {
        name: "Sentence",
        value: `${message.content}`
        });
    autolog.send(mebed);


  }




else


  var msg = message
    
    try {
        function isValidURL(string) {
            var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            return (res !== null)
          };
          
          if(isValidURL(msg.content)) {
          if(message.author.bot) return 
          if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("844255202688892928") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("844073380046307348") || message.member.roles.cache.get("819205048872992768") || message.member.roles.cache.get("814178652869623888"))  return 
           if(linkby.includes(message.channel.id)) return 
           msg.delete();

           var mebed = new Discord.MessageEmbed()
           .setTitle("[Automod] Links")
           .setColor("#b3666c")
           .setTimestamp()
           .addFields({
            name: 'Member',
            value: `${message.author}`,
            inline: true
             }, {
             name: "Channel",
            value: `${message.channel}`,
            inline: true
            }, {
            name: "Sentence",
            value: `${message.content}`
           });

            return message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author} You shouldn't send links in this channel, you can send them in <#810466123891998730>.`).then(message => message.delete({timeout: 10000})).then(autolog.send(mebed))
          }

    
    } catch(err) {
     
    }




// spamming auto mod

  if(message.content.length > 400) {
    if(!message.author.bot) {
    if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("819205048872992768") || message.member.roles.cache.get("844073380046307348"))  return 
    message.delete()
    message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author} sending long messages is prohibited. Continuing will result in a mute.`).then(message => message.delete({timeout: 7000}))
    let bad = new Discord.MessageEmbed()
        .setTitle("[Automod] Long Sentence")
        .setColor("#b3666c")
        .setTimestamp()
        .addFields({
        name: 'Member',
        value: `${message.author}`,
        inline: true
        }, {
        name: "Channel",
        value: `${message.channel}`,
        inline: true
        }, {
        name: "Sentence",
        value: `${message.content}`
        });
    autolog.send(bad);



  }
  }

  else

  if(message.mentions.users.size >= 5) {
    if(message.author.bot) return 
    if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("819205048872992768") || message.member.roles.cache.get("844073380046307348"))  return 
      message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author}, Mentioning more than 5 people is prohibited. Continuing will result in a mute.`).then((m) => m.delete( { timeout: 10000 } ))
      message.delete()
      var as = new Discord.MessageEmbed()
      .setTitle("[Automod] Mass Mentioning")
      .setColor("#b3666c")
      .setTimestamp()
      .addFields({
      name: 'Member',
      value: `${message.author}`,
      inline: true
      }, {
      name: "Channel",
      value: `${message.channel}`,
      inline: true
      })
  autolog.send(as);


}

 
 else 

  
    try {
    var lineArray = message.content.match(/\n/g);
    var number = lineArray.length
     
    if(number >= 5) {
         if(message.member.roles.cache.get("800976899337355294") || message.member.roles.cache.get("845605608387510273") || message.member.roles.cache.get("844073380046307348")) return 
        message.delete()
        return message.channel.send(`<a:Bad_guy:816275808510410792> ${message.author}, You're not allowed to line spam in this channel, continuing will result in in a mute.`).then((m) => m.delete( { timeout: 10000 } ))  

    }



    } catch(err) {
     
    }


}






