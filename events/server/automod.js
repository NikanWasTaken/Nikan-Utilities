let { MessageEmbed, MessageAttachment, WebhookClient } = require("discord.js")
let client = require("../../index.js")
const warnModel = require("../../models/Punishments.js")
const automodModel = require("../../models/automod.js")
const MemberRoles = require("../../models/MemberRoles.js")
const prohibitedwords = require("../../json/bad-words.json")
const logschannel = new WebhookClient({
  id: `910104675716571136`,
  token: `mJQ3F73THOBgvp4E5QHQhJfL28k581qM1IDW88ctLyGLgozKF9U26ygQ_ahwIq4tHwpG`,
}); // https://discord.com/api/webhooks/910104675716571136/mJQ3F73THOBgvp4E5QHQhJfL28k581qM1IDW88ctLyGLgozKF9U26ygQ_ahwIq4tHwpG


// funcations

function isValidInvite(string) {
  var res = string.match(/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/);
  return (res !== null)
};


 function isValidURL(string) {
  var res = string.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi)
  
  return (res !== null)
 };

// edit

client.on('messageUpdate', async (oldMessage, newMessage) => {

    if (newMessage?.author?.bot) return
  if (!newMessage?.content?.length) return
  if (prohibitedwords.includes(newMessage?.content.toLowerCase()) || isValidInvite(newMessage?.content) /* || isValidURL(newMessage?.content) */|| newMessage?.content?.length > 999 || newMessage?.mentions.users.size >= 4) {

  client.emit('messageCreate', newMessage)

  } else return;
  
});


// automod 

client.on("messageCreate", async (message) => {

  // Prohibited Words


  for (var x in prohibitedwords) {
    if (message.toString().toLowerCase().includes(prohibitedwords[x])) {
      if (message.author.bot) { return } // if it's not a bot
      if (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.get("881628276735483955")) { return } // role permissions
      if (message.channel.name.includes("friend") || message.channel.name.includes("staff")) { return }

      message.delete()
      message.channel.send({ content: `${message.author}, you may not use that word in the chat.`, allowedMentions: { parse: ["users"]}  }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

      const automod = new automodModel({
        type: "Prohibited Word",
        userId: message.author.id,
        guildId: message.guildId,
        reason: `Sending a message that contains prohibited words, swear words or filtered words.`,
        date: Date.now(),
      })
      automod.save()

      let dm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Warned in ${message.guild.name}`)
        .addField("Punishment ID", `${automod._id}`, true)
        .addField("Expires", "in 2 days", true)
        .addField("Reason", "[Automod] Sending prohited and filtered words in the chat", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
      message.member.send({ embeds: [dm] }).catch(e => { return })

      const log = new MessageEmbed()
        .setAuthor("Auto Moderation", client.user.displayAvatarURL())
        .setTitle("Prohibited Words")
        .setDescription(`Punishment ID • \`${automod._id}\``)
        .setColor(`${client.embedColor.logYellow}`)
        .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
        .addField("● Other Information", `> Channel: ${message.channel}\n> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
        .addField("● Content", `${message.content.length >= 1024 ? `The message content is too long to show!` : message.content}`)
        .setTimestamp()

      logschannel.send({ embeds: [log] })


    }
  }


  // discord invite links

  try {



    if (isValidInvite(message.content)) {
      if (message.author.bot) { return } // if it's not a bot
      if (message.member.permissions.has("MOVE_MEMBERS") || message.member.roles.cache.get("881628276735483955")) { return } // role permissions
      if (message.channel.name.includes("ad") || message.channel.name.includes("partner") || message.channel.name.includes("advertise") || message.channel.name.includes("staff") || message.channel.name.includes("friend") || message.channel.name.includes("admin") || message.channel.name.includes("mod")) { return } // channel permissions

      message.delete()
      message.channel.send({ content: `${message.author}, you may not send discord invite links in the chat.`, allowedMentions: { parse: ["users"]}  }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

      const automod = new automodModel({
        type: "Discord Invite",
        userId: message.author.id,
        guildId: message.guildId,
        reason: `Sending discord server invite links in the chat.`,
        date: Date.now(),
      })
      automod.save()

      let dm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Warned in ${message.guild.name}`)
        .addField("Punishment ID", `${automod._id}`, true)
        .addField("Expires", "in 2 days", true)
        .addField("Reason", "[Automod] Sending discord server invite links in the chat.", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
      message.member.send({ embeds: [dm] }).catch(e => { return })

      const log = new MessageEmbed()
        .setAuthor("Auto Moderation", client.user.displayAvatarURL())
        .setTitle("Discord Invite")
        .setDescription(`Punishment ID • \`${automod._id}\``)
        .setColor(`${client.embedColor.logYellow}`)
        .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
        .addField("● Other Information", `> Channel: ${message.channel}\n> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
        .addField("● Content", `${message.content.length >= 1024 ? `The message content is too long to show!` : message.content}`)
        .setTimestamp()

      logschannel.send({ embeds: [log] })

    }

    // else

    // links


    //   if (isValidURL(message.content)) {
    //     if (message.author.bot) { return } // if it's not a bot
    //     if (message.member.permissions.has("MANAGE_MESSAGES") || message.member.roles.cache.get("881628276735483955")) { return } // role permissions
    //     if (message.channel.name.includes("ad") || message.channel.name.includes("partner") || message.channel.name.includes("advertise") || message.channel.name.includes("staff") || message.channel.name.includes("friend") || message.channel.name.includes("admin") || message.channel.name.includes("mod") || message.channel.name.includes("music") || message.channel.name.includes("stream")) { return } // channel permissions

    //     message.delete()
    //     message.channel.send({ content: `${message.author}, you may not send links in the chat!`, allowedMentions: { parse: ["users"]}  }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

    //     const automod = new automodModel({
    //       type: "Links",
    //       userId: message.author.id,
    //       guildId: message.guildId,
    //       reason: `Sending website or other links in the chat.`,
    //       date: Date.now(),
    //     })
    //     automod.save()

    //     let dm = new MessageEmbed()
    //       .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
    //       .setTitle(`You've been Warned in ${message.guild.name}`)
    //       .addField("Punishment ID", `${automod._id}`, true)
    //       .addField("Expires", "in 2 days", true)
    //       .addField("Reason", "[Automod] Sending links in the chat!", false)
    //       .setColor(`${client.embedColor.modDm}`)
    //       .setTimestamp()
    //     message.member.send({ embeds: [dm] }).catch(e => { return })

    //     const log = new MessageEmbed()
    //       .setAuthor("Auto Moderation", client.user.displayAvatarURL())
    //       .setTitle("Link")
    //       .setDescription(`Punishment ID • \`${automod._id}\``)
    //       .setColor(`${client.embedColor.logYellow}`)
    //       .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
    //       .addField("● Other Information", `> Channel: ${message.channel}\n> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
    //       .addField("● Content", `${message.content.length >= 1024 ? `The message content is too long to show!` : message.content}`)
    //       .setTimestamp()

    //     logschannel.send({ embeds: [log] })

    //   }

  } catch (error) {

  }

  // Large messages

  if (message.content.length > 999) {
    if (message.author.bot) { return } // if it's not a bot
    if (message.member.permissions.has("MOVE_MEMBERS") || message.member.roles.cache.get("881628276735483955")) { return } // role permissions
    if (message.channel.name.includes("ad") || message.channel.name.includes("partner") || message.channel.name.includes("advertise") || message.channel.name.includes("staff") || message.channel.name.includes("friend") || message.channel.name.includes("admin") || message.channel.name.includes("stream")) { return } // channel permissions


    message.delete()
    message.channel.send({ content: `${message.author}, you may not send very big messages in the chat!`, allowedMentions: { parse: ["users"]}  }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

    const automod = new automodModel({
      type: "Large Messages",
      userId: message.author.id,
      guildId: message.guildId,
      reason: `Sending a huge amount of characters/large messages in the chat.`,
      date: Date.now(),
    })
    automod.save()

    let dm = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`You've been Warned in ${message.guild.name}`)
      .addField("Punishment ID", `${automod._id}`, true)
      .addField("Expires", "in 2 days", true)
      .addField("Reason", "[Automod] Sending very large messages in the chat.", false)
      .setColor(`${client.embedColor.modDm}`)
      .setTimestamp()
    message.member.send({ embeds: [dm] }).catch(e => { return })

    const log = new MessageEmbed()
      .setAuthor("Auto Moderation", client.user.displayAvatarURL())
      .setTitle("Large Message")
      .setDescription(`Punishment ID • \`${automod._id}\``)
      .setColor(`${client.embedColor.logYellow}`)
      .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
      .addField("● Other Information", `> Channel: ${message.channel}\n> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
      .addField("● Content", `${message.content.length >= 1024 ? `The message content is too long to show!` : message.content}`)
      .setTimestamp()

    logschannel.send({ embeds: [log] })
  }


  else // Mass Mentioning

    if (message.mentions.users.size >= 4) {
      if (message.author.bot) { return } // if it's not a bot
      if (message.member.permissions.has("MOVE_MEMBERS") || message.member.roles.cache.get("881628276735483955")) { return } // role permissions
      if (message.channel.name.includes("staff") || message.channel.name.includes("friend") || message.channel.name.includes("admin")) { return } // channel permissions

      message.delete()
      message.channel.send({ content: `${message.author}, you may not mention more then 4 users in the chat!`, allowedMentions: { parse: ["users"]}  }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

      const automod = new automodModel({
        type: "Mass Mentioning",
        userId: message.author.id,
        guildId: message.guildId,
        reason: `Mentions more than 4 users in the chat!`,
        date: Date.now(),
      })
      automod.save()

      let dm = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`You've been Warned in ${message.guild.name}`)
        .addField("Punishment ID", `${automod._id}`, true)
        .addField("Expires", "in 2 days", true)
        .addField("Reason", "[Automod] Mentioning more than 4 users", false)
        .setColor(`${client.embedColor.modDm}`)
        .setTimestamp()
      message.member.send({ embeds: [dm] }).catch(e => { return })

      const log = new MessageEmbed()
        .setAuthor("Auto Moderation", client.user.displayAvatarURL())
        .setTitle("Mass Mentioning")
        .setDescription(`Punishment ID • \`${automod._id}\``)
        .setColor(`${client.embedColor.logYellow}`)
        .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
        .addField("● Other Information", `> Channel: ${message.channel}\n> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
        .addField("● Content", `${message.content.length >= 1024 ? `The message content is too long to show!` : message.content}`)
        .setTimestamp()

      logschannel.send({ embeds: [log] })

    }

})






// // spamming automod


// const usersMap = new Map();
// const LIMIT = 6;
// const TIME = 7000;
// const DIFF = 3000;

// client.on("messageCreate", async(message) => {

//     if (message.author.bot) { return } // if it's not a bot
//     // if (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.get("881628276735483955")) { return } // role permissions
//     // if (message.channel.name.includes("staff") || message.channel.name.includes("friend") || message.channel.name.includes("admin")) { return } // channel permissions

//     if(usersMap.has(message.author.id)) {

//         const userData = usersMap.get(message.author.id);
//         const { lastMessage, timer } = userData;
//         const difference = message.createdTimestamp - lastMessage.createdTimestamp;
//         let msgCount = userData.msgCount;

//         if(difference > DIFF) {

//             clearTimeout(timer);
//             userData.msgCount = 1;
//             userData.lastMessage = message;
//             userData.timer = setTimeout(() => {
//                 usersMap.delete(message.author.id);
//             }, TIME);
//             usersMap.set(message.author.id, userData)
//         }

//         else {

//             ++msgCount;

//             if(parseInt(msgCount) === LIMIT) {
                

//               const messages = message.channel.messages.fetch({ limit: LIMIT })
//               const usermsgs = (await messages).filter(m => m.author.id === message.author.id)

//               message.channel.bulkDelete(usermsgs)
//               message.channel.send({ content: `${message.author} you're sending messages too fast!`, allowedMentions: { parse: ["users"]} }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })
//               usersMap.delete(message.author.id)

//               const automod = new automodModel({
//                 type: "Spamming",
//                 userId: message.author.id,
//                 guildId: message.guildId,
//                 reason: `Sending messages too fast!`,
//                 date: Date.now(),

//               })
//               automod.save()
        
//               let dm = new MessageEmbed()
//                 .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
//                 .setTitle(`You've been Warned in ${message.guild.name}`)
//                 .addField("Punishment ID", `${automod._id}`, true)
//                 .addField("Expires", "in 2 days", true)
//                 .addField("Reason", "[Automod] sending messages too fast! (spam)", false)
//                 .setColor(`${client.embedColor.modDm}`)
//                 .setTimestamp()
//               message.member.send({ embeds: [dm] }).catch(e => { return })

//               const log = new MessageEmbed()
//               .setAuthor("Auto Moderation", client.user.displayAvatarURL())
//               .setTitle("Spamming")
//               .setDescription(`Punishment ID • \`${automod._id}\``)
//               .setColor(`${client.embedColor.logYellow}`)
//               .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
//               .addField("● Other Information", `> Channel: ${message.channel}\n> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
//               .setTimestamp()
      
//             logschannel.send({ embeds: [log] })


//             } else {
//                 userData.msgCount = msgCount;
//                 usersMap.set(message.author.id, userData);
//             }
//         }

//     } else {

//         let fn = setTimeout(() => {
//             usersMap.delete(message.author.id);
//         }, TIME);

//         usersMap.set(message.author.id, {
//             msgCount: 1,
//             lastMessage : message,
//             timer : fn
//         });
//     }
// })


































































































































































































// client.on("messageCreate", async (message) => {



//   const automodmap = automodModel.find({
//     userId: message.author.id,
//     guildId: message.guildId,
//   })

//   const automodcount = [];

//   automodmap.map((warn, i) => {
//     automodcount.push(`${i + 1}`)
//   })

//   if (automodcount.length == 2) {

//     const data = new MemberRoles({
//       guildid: message.guild.id,
//       user: message.author.id,
//       content: [{ roles: message.member.roles.cache.map(role => role.id), reason: "Collecting the roles after reaching 2 automod warnings!" }]
//     })
//     data.save()

//     const data2 = new warnModel({
//       type: "Mute",
//       userId: message.author.id,
//       guildId: message.guildId,
//       moderatorId: client.user.id,
//       reason: "Reaching 2 automod strikes.",
//       timestamp: Date.now(),
//     })

//     data2.save()

//     user.roles.set(null).then(await message.member.roles.add("795353284042293319"))


//     let warndm = new MessageEmbed()
//       .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
//       .setTitle(`You've been Muted in ${message.guild.name}`)
//       .addField("Punishment ID", `${data2._id}`, true)
//       .addField("Duration", "2 hours", true)
//       .addField("Reason", "Reaching 2 automod strikes", false)
//       .setColor(`${client.embedColor.modDm}`)
//       .setTimestamp()
//     message.member.send({ embeds: [warndm] }).catch(e => { return })

//     const log = new MessageEmbed()
//       .setAuthor("Auto Moderation", client.user.displayAvatarURL())
//       .setTitle("Mute")
//       .setDescription(`Punishment ID • \`${data2._id}\``)
//       .setColor(`${client.embedColor.logAqua}`)
//       .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
//       .addField("● Other Information", `> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
//       .addField("● Mute Information", `> Duration: 2 hours\n> Reason: Reaching 2 automod strikes`)
//       .setTimestamp()

//     logschannel.send({ embeds: [log] })


//     setTimeout(async () => {

//       db.findOne({ guildid: message.guild.id, user: message.author.id }, async (err, data) => {
//         if (err) throw err;
//         if (data) {
//           data.content.map((w, i) => message.member.roles.set(w.roles).then(message.member.roles.remove("795353284042293319")))
//           await db.findOneAndDelete({ user: message.author.id, guildid: message.guild.id })
//         }
//       })

//       const log = new MessageEmbed()
//         .setAuthor("Auto Moderation", client.user.displayAvatarURL())
//         .setTitle("Unmute")
//         .setColor(`${client.embedColor.logGreen}`)
//         .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
//         .addField("● Other Information", `> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
//         .addField("● Unmute Information", `> Unmute after 2 hours mute\n> Mute reason: reaching 2 automod strikes`)
//         .setTimestamp()

//       logschannel.send({ embeds: [log] })

//     }, 7200000) // 2 hours

//   } else if (automodcount.length == 4) {

//     const data = new MemberRoles({
//       guildid: message.guild.id,
//       user: message.author.id,
//       content: [{ roles: message.member.roles.cache.map(role => role.id), reason: "Collecting the roles after reaching 4 automod warnings!" }]
//     })
//     data.save()

//     const data2 = new warnModel({
//       type: "Mute",
//       userId: message.author.id,
//       guildId: message.guildId,
//       moderatorId: client.user.id,
//       reason: "Reaching 4 automod strikes.",
//       timestamp: Date.now(),
//     })

//     data2.save()

//     user.roles.set(null).then(await message.member.roles.add("795353284042293319"))


//     let warndm = new MessageEmbed()
//       .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
//       .setTitle(`You've been Muted in ${message.guild.name}`)
//       .addField("Punishment ID", `${data2._id}`, true)
//       .addField("Duration", "6 hours", true)
//       .addField("Reason", "Reaching 4 automod strikes", false)
//       .setColor(`${client.embedColor.modDm}`)
//       .setTimestamp()
//     message.member.send({ embeds: [warndm] }).catch(e => { return })

//     const log = new MessageEmbed()
//       .setAuthor("Auto Moderation", client.user.displayAvatarURL())
//       .setTitle("Mute")
//       .setDescription(`Punishment ID • \`${data2._id}\``)
//       .setColor(`${client.embedColor.logAqua}`)
//       .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
//       .addField("● Other Information", `> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
//       .addField("● Mute Information", `> Duration: 6 hours\n> Reason: Reaching 4 automod strikes`)
//       .setTimestamp()

//     logschannel.send({ embeds: [log] })


//     setTimeout(async () => {

//       db.findOne({ guildid: message.guild.id, user: message.author.id }, async (err, data) => {
//         if (err) throw err;
//         if (data) {
//           data.content.map((w, i) => message.member.roles.set(w.roles).then(message.member.roles.remove("795353284042293319")))
//           await db.findOneAndDelete({ user: message.author.id, guildid: message.guild.id })
//         }
//       })

//       const log = new MessageEmbed()
//         .setAuthor("Auto Moderation", client.user.displayAvatarURL())
//         .setTitle("Unmute")
//         .setColor(`${client.embedColor.logGreen}`)
//         .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
//         .addField("● Other Information", `> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
//         .addField("● Unmute Information", `> Unmute after 6 hours mute\n> Mute reason: reaching 4 automod strikes`)
//         .setTimestamp()

//       logschannel.send({ embeds: [log] })

//     }, 21600000) // 6 hours

//   } else if (automodcount.length == 6) {

//     const data2 = new warnModel({
//       type: "Ban",
//       userId: user.user.id,
//       guildId: message.guild.id,
//       moderatorId: `${client.user.id}`,
//       reason: "Reaching 6 automod strikes",
//       timestamp: Date.now(),
//     })

//     data2.save()

//     let warndm = new MessageEmbed()
//       .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
//       .setTitle(`You've been Banned from ${message.guild.name}`)
//       .setDescription(`You can appeal this ban by clicking [here](https://forms.gle/dW8RGLA65ycC4vcM7).`)
//       .addField("Punishment ID", `${data2._id}`, true)
//       .addField("Reason", "Reaching 6 automod strikes", false)
//       .setColor(`${client.embedColor.modDm}`)
//       .setTimestamp()
//     user.send({ embeds: [warndm] }).catch(e => { return })

//     const log = new MessageEmbed()
//       .setAuthor("Auto Moderation", client.user.displayAvatarURL())
//       .setTitle("Ban")
//       .setColor(`${client.embedColor.logRed}`)
//       .addField("● User Information", `> ${message.author}\n> Tag: ${message.author.tag}\n> ID: ${message.author.id}`, true)
//       .addField("● Other Information", `> Date: <t:${~~(Date.now() / 1000)}:f>\n`, true)
//       .addField("● Ban Information", `> Reason: Reaching 6 automod strikes`)
//       .setTimestamp()

//     logschannel.send({ embeds: [log] })

//     message.member.ban({
//       reason: "Reaching 6 automod stikes"
//     })

//   }

// })
