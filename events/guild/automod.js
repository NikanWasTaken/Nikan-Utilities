let client = require("../../index.js")
const prohibitedwords = require("../../json/bad-words.json")

function isValidInvite(string) {
  var res = string.match(/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/);
  return (res !== null)
};
function isValidURL(string) {
  var res = string.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi)
  return (res !== null)
};

// automod 
const { badwords } = require("../../functions/automod/badwords.js")
const { invites } = require("../../functions/automod/invites.js")
const { largeMessage } = require("../../functions/automod/large-msg.js")
// const { links } = require("../../functions/automod/links.js")
const { massMention } = require("../../functions/automod/mass-ping.js")

client.on("messageCreate", async (message) => {

  if (message?.guild?.id !== `${client.server.id}`) return;

  badwords(message)
  invites(message)
  largeMessage(message)
  massMention(message)

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