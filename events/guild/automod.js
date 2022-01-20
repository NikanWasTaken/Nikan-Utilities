const client = require("../../index.js")
const prohibitedwords = require("../../json/bad-words.json")
const config = require("../../json/ignores.json").automod;
const automodModel = require("../../models/automod.js");
const ms = require("ms")

function isValidInvite(string) {
  var res = string.match(/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/);
  return (res !== null)
};
function isValidURL(string) {
  var res = string.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi)
  return (res !== null)
};


client.on("messageCreate", async (message) => {

  if (message?.guild?.id !== `${client.server.id}`) return;

  if (message?.content.includes(prohibitedwords)) {

    if (
      message?.author.bot ||
      config.links.permissions.some(perm => message?.member.permissions.has(perm)) ||
      message?.member.roles.cache.get(config["bypass-role"]) ||
      config.badwords.channels.some(ch => message?.channel.name.includes(ch))
    ) return;

    message?.delete()
    message?.channel.send({
      content: `${message?.author}, you may not use that word in the chat.`,
      allowedMentions: { parse: ["users"] }
    }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

    const automod = new automodModel({
      type: "Prohibited Word",
      userId: message?.author.id,
      guildId: message?.guildId,
      reason: `Sending a message that contains prohibited words, swear words or filtered words.`,
      date: Date.now(),
      expires: Date.now() + ms('2 days')
    })
    automod.save()

    let dm = new MessageEmbed()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTitle(`You've been Warned in ${message?.guild.name}`)
      .addField("Punishment ID", `${automod._id}`, true)
      .addField("Expires", "in 2 days", true)
      .addField("Reason", "[Automod] Sending prohited and filtered words in the chat", false)
      .setColor(`${client.color.modDm}`)
      .setTimestamp()
    message?.member.send({
      embeds: [dm]
    }).catch(() => { return })

    client.log.automod({
      type: "Prohibited Word",
      color: "WARN",
      user: `${message?.author.id}`,
      date: `${Date.now()}`,
      channel: `${message?.channelId}`,
      id: `${automod._id}`,
      content: `${message?.content}`
    })

  }

  else

    if (isValidInvite(message?.content)) {

      if (
        message?.author.bot ||
        config.invites.permissions.some(perm => message?.member.permissions.has(perm)) ||
        message?.member.roles.cache.get(config["bypass-role"]) ||
        config.invites.channels.some(ch => message?.channel.name.includes(ch))
      ) return;

      message?.delete()
      message?.channel.send({
        content: `${message?.author}, you may not send discord invite links in the chat.`,
        allowedMentions: { parse: ["users"] }
      }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) });

      const automod = new automodModel({
        type: "Discord Invite",
        userId: message?.author.id,
        guildId: message?.guildId,
        reason: `Sending discord server invite links in the chat.`,
        date: Date.now(),
        expires: Date.now() + ms('2 days')
      })
      automod.save()

      let dm = new MessageEmbed()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`You've been Warned in ${message?.guild.name}`)
        .addField("Punishment ID", `${automod._id}`, true)
        .addField("Expires", "in 2 days", true)
        .addField("Reason", "[Automod] Sending discord server invite links in the chat.", false)
        .setColor(`${client.color.modDm}`)
        .setTimestamp()
      message?.member.send({ embeds: [dm] })
        .catch(() => { return })

      client.log.automod({
        type: "Discord Invite",
        color: "WARN",
        user: `${message?.author.id}`,
        date: `${Date.now()}`,
        channel: `${message?.channelId}`,
        id: `${automod._id}`,
        content: `${message?.content}`
      })

    }

    else

      if (message?.content.length > 999) {
        if (
          message?.author.bot ||
          config["large-messages"].permissions.some(perm => message?.member.permissions.has(perm)) ||
          message?.member.roles.cache.get(config["bypass-role"]) ||
          config["large-messages"].channels.some(ch => message?.channel.name.includes(ch))
        ) return;


        message?.delete()
        message?.channel.send({
          content: `${message?.author}, you may not send very big messages in the chat!`,
          allowedMentions: { parse: ["users"] }
        }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

        const automod = new automodModel({
          type: "Large Messages",
          userId: message?.author.id,
          guildId: message?.guildId,
          reason: `Sending a huge amount of characters/large messages in the chat.`,
          date: Date.now(),
          expires: Date.now() + ms('2 days')
        })
        automod.save()

        let dm = new MessageEmbed()
          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setTitle(`You've been Warned in ${message?.guild.name}`)
          .addField("Punishment ID", `${automod._id}`, true)
          .addField("Expires", "in 2 days", true)
          .addField("Reason", "[Automod] Sending very large messages in the chat.", false)
          .setColor(`${client.color.modDm}`)
          .setTimestamp()
        message?.member.send({
          embeds: [dm]
        }).catch(() => { return })


        client.log.automod({
          type: "Large Message",
          color: "WARN",
          user: `${message?.author.id}`,
          date: `${Date.now()}`,
          channel: `${message?.channelId}`,
          id: `${automod._id}`,
          content: `${message?.content}`
        })
      }

      else

        /**
if (isValidURL(message.content)) {

  if (
    message.author.bot ||
    config.links.permissions.some(perm => message.member.permissions.has(perm)) ||
    message.member.roles.cache.get(config["bypass-role"]) ||
    config.links.channels.some(ch => message?.channel.name.includes(ch))
  ) return;

  message.delete()
  message.channel.send({
    content: `${message.author}, you may not send links in the chat!`,
    allowedMentions: { parse: ["users"] }
  }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) });

  const automod = new automodModel({
    type: "Links",
    userId: message.author.id,
    guildId: message.guildId,
    reason: `Sending website or other links in the chat.`,
    date: Date.now(),
    expires: Date.now() + ms('2 days')
  })
  automod.save()

  let dm = new MessageEmbed()
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    .setTitle(`You've been Warned in ${message.guild.name}`)
    .addField("Punishment ID", `${automod._id}`, true)
    .addField("Expires", "in 2 days", true)
    .addField("Reason", "[Automod] Sending links!", false)
    .setColor(`${client.color.modDm}`)
    .setTimestamp()
  message.member.send({
    embeds: [dm]
  }).catch(() => { return });

  client.log.automod({
    type: "Links",
    color: "WARN",
    user: `${message.author.id}`,
    date: `${Date.now()}`,
    channel: `${message.channelId}`,
    id: `${automod._id}`,
    content: `${message.content}`
  })

} 

else
*/

        if (message.mentions.users.size > 4) {

          if (
            message.author.bot ||
            config["mass-ping"].permissions.some(perm => message.member.permissions.has(perm)) ||
            message.member.roles.cache.get(config["bypass-role"]) ||
            config["mass-ping"].channels.some(ch => message?.channel.name.includes(ch))
          ) return;

          message.delete()
          message.channel.send({
            content: `${message.author}, you may not mention more then 4 users in the chat!`,
            allowedMentions: { parse: ["users"] }
          }).then((msg) => { setTimeout(() => { msg.delete() }, 5000) })

          const automod = new automodModel({
            type: "Mass Mentioning",
            userId: message.author.id,
            guildId: message.guildId,
            reason: `Mentions more than 4 users in the chat!`,
            date: Date.now(),
            expires: Date.now() + ms('2 days')
          })
          automod.save()

          let dm = new MessageEmbed()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`You've been Warned in ${message.guild.name}`)
            .addField("Punishment ID", `${automod._id}`, true)
            .addField("Expires", "in 2 days", true)
            .addField("Reason", "[Automod] Mentioning more than 4 users", false)
            .setColor(`${client.color.modDm}`)
            .setTimestamp()
          message.member.send({
            embeds: [dm]
          }).catch(() => { return });

          client.log.automod({
            type: "Mass Mention",
            color: "WARN",
            user: `${message.author.id}`,
            date: `${Date.now()}`,
            channel: `${message.channelId}`,
            id: `${automod._id}`,
            content: `${message.content}`
          })

        }

})



client.on('messageUpdate', async (newMessage) => {

  if (newMessage?.author?.bot) return
  if (!newMessage?.content?.length) return
  if (prohibitedwords.includes(newMessage?.content.toLowerCase()) ||
    isValidInvite(newMessage?.content) /* ||
     isValidURL(newMessage?.content) */ ||
    newMessage?.content?.length > 999 ||
    newMessage?.mentions.users.size >= 4) {

    client.emit('messageCreate', newMessage)

  } else return;

});