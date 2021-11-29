const client = require("../index.js")
const config = require('../config.json')
const prefix = config.prefix
const Discord = require("discord.js")
const ServerID = config.ServerID
const blacklist = require("../models/mod-blacklist")




    var maillog = new Discord.WebhookClient('844419333097783306', 'Bi2Wbn2joMaXCEh5PpC6FfWVBEVJU6wvBnLnnkiT7wfgxBe_xn-LEDa-sm7zd2D7Smbw');

     const discord = require("discord.js");
const { user } = require("../index.js")
     const catname = "📬 | Modmail"

    client.on("channelDelete", (channel) => {
      if (channel.parentID == channel.guild.channels.cache.find((x) => x.name == catname).id) {
          const person = channel.guild.members.cache.find((x) => x.id == channel.name)
  
          if (!person) return;
  
  
      }
  
  
  })
  
  
  
  
  
  client.on("message", async message => {
      if (message.author.bot) return;
  
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      let command = args.shift().toLowerCase();
  
  
             if (command == "close") {
                if(message.channel.parent.id !== "844123888966828072") return message.channel.send(`${message.author}, you can only use this command in Modmail Category!`).then(message => message.delete({timeout: 5000})).then(() => message.delete())
              if (!message.content.startsWith(prefix)) return;
              if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(modonly).then(message => message.delete({timeout: 5000})).then(() => message.delete())
              if (message.channel.parentID == message.guild.channels.cache.find((x) => x.name == catname).id) {
  
                  const person = message.guild.members.cache.get(message.channel.name)
    

  
                  if (!person) {
                      return message.channel.send("I can't close this thread, Because the channel's name has been changed.")
                  }
  
                  await message.channel.delete()
  
                  var thx = new Discord.MessageEmbed() 
                  .setAuthor(message.author.tag)
                  .setURL("https://discord.gg/qFcGb2NztG")
                  .setDescription(`Thanks for contacting the ${message.guild.name}. If you need anymore help feel free to direct message us again.`)
                  .setFooter(`Moderator`)
                  .setTimestamp()
                  .setColor("#e6cc93")

                  let yembed = new discord.MessageEmbed()
                      .setAuthor("Thread Closed", client.user.displayAvatarURL())
                      .setColor("ORANGE")
                      .setDescription(`${message.author} has closed the Modmail thread.`)
                      .setFooter("Sending another messages will create a new thread", client.guilds.cache.get("757268973674037315").iconURL( { dynamic: true }))
                      .setTimestamp()
                      
                      let youbot = new Discord.MessageEmbed() 
                      .setAuthor(message.author.tag, message.author.displayAvatarURL( {dynamic: true} ))
                      .setDescription(`Thanks for contacting the ${message.guild.name}. If you need anymore help feel free to direct message us again.`)
                      .setFooter(`Moderator`)
                      .setTimestamp()
                      .setColor("#e6cc93")

                  let logbaa = new Discord.MessageEmbed()
                  .setAuthor(`Modmail closed | ${person.user.tag}`)
                  .addField(`Moderator`, message.author, true)
                  .addField("Member", person.user.tag, true)
                  .setColor("ORANGE")
                  .setTimestamp()
  
                   
               
              
                   person.send(youbot)
                   return person.send(yembed).then(() => maillog.send(logbaa))
  
              }
          } else if (command == "open") {
            
              if (!message.content.startsWith(prefix)) return;
              const category = message.guild.channels.cache.find((x) => x.name == catname)

              if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(modonly).then(message => message.delete({timeout: 5000})).then(() => message.delete())
                if(message.channel.parent.id !== "795686516285636608") return message.channel.send(`${message.author}, you can only use this command in Staff Category!`).then(message => message.delete({timeout: 5000})).then(() => message.delete())
  
              if (isNaN(args[0]) || !args.length) {
                  var oo = new Discord.MessageEmbed().setDescription("<a:red_x:872203367718457424> Please provide a user ID.").setColor("RED")
                  return message.channel.send(oo).then(message => message.delete({timeout: 5000})).then(() => message.delete())
              }
  
              const target = message.guild.members.cache.find((x) => x.id === args[0])
  
              if (!target) {
                  var lio = new Discord.MessageEmbed().setDescription("<a:red_x:872203367718457424> Can not find that user.").setColor("RED")
                  return message.channel.send(lio).then(message => message.delete({timeout: 5000})).then(() => message.delete())
              }
  
  
              const channel = await message.guild.channels.create(target.id, {
                  type: "text",
                  parent: category.id,
                  topic: "Mail is Direct Opened by **" + message.author.username + "** to make contact with " + message.author.tag
              })
  
              let nembed = new discord.MessageEmbed()
                  .setAuthor("User information", target.user.displayAvatarURL({ dynamic: true }))
                  .setColor("RANDOM")
                  .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                  .addField("Name", target.user.username)
                  .addField("Account Creation Date", target.user.createdAt)
                  .addField("Direct Contact", "Yes - A staff member opened this modmail.")
  
              channel.send(nembed)
              message.react("✅")
  
              let uembed = new discord.MessageEmbed()
                  .setAuthor("Direct Thread Opened")
                  .setColor("#e6cc93")
                  .setFooter(`Thread opened by: ${message.author.tag}`)
                  .setTimestamp()
                  .setDescription("You have been contacted by Staff of **" + message.guild.name + "**, Please wait until they send another message to you!");


                  let logbwa = new Discord.MessageEmbed()
                  .setAuthor(`Modmail opened | ${target.user.tag}`)
                  .addField(`Moderator`, message.author, true)
                  .addField("Member", target.user.tag, true)
                  .addField("Direct", "Yes - A staff member opened this modmial")
                  .setColor("ORANGE")
                  .setTimestamp()

              target.send(uembed).then(() => maillog.send(logbwa))
  
              let newEmbed = new discord.MessageEmbed()
                  .setDescription("Opened The Mail: <#" + channel + ">")
                  .setColor("GREEN");
  
              return message.channel.send(newEmbed);
  
          }
      
  
  
          
  
  
  
  
  
      if (message.channel.parentID) {
  
          const category = message.guild.channels.cache.find((x) => x.name == catname)
  
          if (message.channel.parentID == category.id) {
              let member = message.guild.members.cache.get(message.channel.name)
  
              if (!member) return message.channel.send('Unable To Send Message')
  
              let lembed = new discord.MessageEmbed()
                  .setColor("GREEN")
                  .setAuthor(`Staff Team`, "https://cdn.discordapp.com/attachments/870637449158742057/870638061803954236/Fuc.png")
                  .setDescription(message.content)
                  .setFooter("Respond")
                  .setTimestamp()

               if(!message.attachments.size) {
               member.send(lembed)
                message.react("✅")

               } else 
                member.send(lembed.setImage(message.attachments.first().url))
               message.react("✅")

          }
  
  
      }
  
      if (!message.guild) {

        blacklist.findOne({ id : message.author.id }, async(err, data) => {
            if(err) throw err;
            if(!data) {


          const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => { })
          if (!guild) return;
          const category = guild.channels.cache.find((x) => x.name == catname)
          if (!category) return;
          const main = guild.channels.cache.find((x) => x.name == message.author.id)
  
  
          if (!main) {

            let rr = new Discord.MessageEmbed()
            .setAuthor(`Nikan's World Modmail`, client.user.displayAvatarURL())
            .setTitle("Are you sure you want to open a ticket?")
            .setDescription(`✅ - Yes I have a question.\n❌ - No I dm the bot by mistake.`)
            .setColor("BLUE")
            .setFooter("React with a compatible emoji")
              
            message.channel.send(rr).then(async (msg) => {
            msg.react("✅")
            msg.react("❌")
          const filter = (reaction, user) => {
          return user.id === message.author.id
      };
      
      const collector = msg.createReactionCollector(filter, { time: 150000 });
      
      collector.on('collect', async(reaction, user) => {
      
          if (reaction.emoji.name === "❌"){
          var ee = new Discord.MessageEmbed()
          .setDescription("Opening a modmail has been canceled!")
          .setColor("#ff0000")
           msg.edit(ee)
         msg.reactions.removeAll()
          }
      
          if (reaction.emoji.name === "✅"){
      
         
            let mx = await guild.channels.create(message.author.id, {
                type: "text",
                parent: category.id,
                topic: "This mail is created for helping  **" + message.author.tag + " **"
            })

            let sembed = new discord.MessageEmbed()
                .setAuthor("Thread Created")
                .setColor("#e6cc93")
                .setDescription("**Your ticket has created, staff team wil respond to you as soon as posible.**")
                .setFooter("Your message has been sent", client.guilds.cache.get("757268973674037315").iconURL( { dynamic: true }))
                .setTimestamp()

                let logbea = new Discord.MessageEmbed()
                .setAuthor(`Modmail opened | ${message.author.tag}`)
                .addField("Member", message.author.tag, true)
                .addField("Direct", "No - A not staff member opened this modmial")
                .setColor("ORANGE")
                .setTimestamp()


            message.author.send(sembed).then(() => maillog.send(logbea))
            message.react("✅")


            let eembed = new discord.MessageEmbed()
                .setAuthor("User information", message.author.displayAvatarURL({ dynamic: true }))
                .setColor("#e6cc93")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .addField("Name", message.author.username)
                .addField("Account Creation Date", message.author.createdAt)
                .addField("Direct Contact", "No - A none staff opened this modmail.")


             mx.send("[ <@&867685674496950272> ]", eembed)
             message.react("✅")






        
        var areufkingkiddingme = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.content)
            .setTimestamp() 
            .setFooter("Respond")

             if(!message.attachments.size) {
             mx.send(areufkingkiddingme)
              message.react("✅")

             } else 
              mx.send(areufkingkiddingme.setImage(message.attachments.first().url))
             message.react("✅")

          }
      
      
      })
      })


          }
  
              message.react("✅")
  
  
          var fk = new Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
              .setDescription(message.content)

              .setTimestamp() 

               if(!message.attachments.size) {
               main.send(fk)
                message.react("✅")

               } else 
                main.send(fk.setImage(message.attachments.first().url))
               message.react("✅")

            } else 
            message.author.send("Sorry, but you're blacklisted from opening modmail. If you think this punishment is unfair, please dm a admin or above!")

        })
            
            }
 

})